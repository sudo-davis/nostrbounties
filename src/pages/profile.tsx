import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { RelayPool } from "nostr-relaypool";
import { convertTimestamp} from "../utils";

import SideBarMenu from "../components/sidebarMenu/sidebarMenu";
import BountiesNotFound from "../components/errors/bountiesNotFound";
import ProfileCard from "../components/profileCard/profileCard";
import BountyCard from "../components/bounty/bountyCardShortInfo/bountyCardShortInfo";


function Profile() {
  let relays = JSON.parse(localStorage.getItem("relays")!);
  const params = useParams();

  let [metaData, setMetada] = useState({});
  let [titles, setTitles] = useState<string[]>([]);
  let [rewards, setRewards] = useState<string[]>([]);
  let [name, setName] = useState<string>('');
  let [picture, setPicture] = useState<string>('');
  let [ids, setIds] = useState<string[]>([]);
  let [bountyNotFound, setBountyNotFound] = useState(false);
  let [dataLoaded, setDataLoaded] = useState(false);
  let [pubkey, setPubkeys] = useState<string[]>([]);
  let [creationDate, setCreationDate] = useState<string[]>([]);

  let subFilterMetaData = [
    {
      authors: [`${params.id}`],
      kinds: [0],
    },
  ];
  let subFilterContent = [
    {
      authors: [`${params.id}`],
      kinds: [30023],
      "#t": ["bounty"],
    },
  ];
  useEffect(() => {
    let relayPool = new RelayPool(relays);

    relayPool.onerror((err, relayUrl) => {
      console.log("RelayPool error", err, " from relay ", relayUrl);
    });
    relayPool.onnotice((relayUrl, notice) => {
      console.log("RelayPool notice", notice, " from relay ", relayUrl);
    });

    relayPool.subscribe(
      subFilterMetaData,
      relays,
      (event, isAfterEose, relayURL) => {
        let parsedContent = JSON.parse(event.content);
        let data = {
          name: parsedContent.display_name,
          profilePic: parsedContent.picture,
          LnAddress: parsedContent.lud16,
          about: parsedContent.about,
          nip05: parsedContent.nip05,
        };
        setMetada(data);
        setName(parsedContent.display_name)
        setPicture(parsedContent.picture)
      }
    );

    relayPool.subscribe(
      subFilterContent,
      relays,
      (event, isAfterEose, relayURL) => {
        let parseDate = parseInt(event.tags[3][1]);
        let date = convertTimestamp(parseDate);
        setDataLoaded(true);
        let bountyTitle = event.tags[1][1];
        let bountyReward = event.tags[2][1];
        let bountyDatePosted = date;

        setIds((arr) => [...arr, event.id]);
        setCreationDate((arr) => [...arr, bountyDatePosted]);
        setTitles((arr) => [...arr, bountyTitle]);
        setRewards((arr) => [...arr, bountyReward]);
        setPubkeys((arr) => [...arr, event.pubkey]);

      }
    );

    setTimeout(() => {
      relayPool.close().then(() => {
        console.log("connection closed");
      });
      setBountyNotFound(true);
    }, 20000);
  }, []);

  return (
    <div className="flex justify-between sm:block">
      <div className="basis-3/12">
        <SideBarMenu />
      </div>

      <div className="p-3 h-screen overflow-y-scroll basis-9/12 lg:px-10 sm:h-screen px-2 dark:bg-background-dark-mode">
        <ProfileCard metaData={metaData} />
        {dataLoaded ? (
          titles.map((item, index) => {
            return (
              <div>
                <BountyCard
                  title={titles[index]}
                  reward={rewards[index]}
                  id={ids[index]}
                  dates={creationDate[index]}
                  pubkeys={pubkey[index]}
                  name={name}
                  picture={picture}
                />
              </div>
            );
          })
        ) : (
          <div className="animate-pulse text-center p-6 font-medium text-dark-text dark:text-gray-2">
            Loading...
          </div>
        )}
        {bountyNotFound ? <BountiesNotFound /> : null}
      </div>
    </div>
  );
}

export default Profile;
