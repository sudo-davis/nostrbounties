import BountyCard from "../bountyCardShortInfo/bountyCardShortInfo";
import {useState, useEffect} from "react"
import { convertTimestamp } from "../../../utils";
import defaultRelays from "../../../consts";
import { RelayPool } from 'nostr-relaypool';

function bountyFeed() {

    const [content, setContent] = useState([]);
    const [pubkey, setPubkey] = useState([]);
    const [ids, setIds] = useState([]);
    const [creationDate, setCreationDate] = useState([]);
    const [bountyNotFound, setBountyNotFound] = useState(false)
    const [iterator, setIterator] = useState(0)
    const [loading, setLoading] = useState('loading')
    
    function loadMoreContent(){
    setIterator(iterator + 1)
    setLoading('loading')
    }
    
    useEffect(()=>{
    
    let relays = defaultRelays;
    let arr_content = [];
    let arr_pubkeys = [];
    let arr_ids = [];
    let arr_postDated = [];
    let subFilter = [{
      //'#t':['bounty'],
      kinds:[0]
    }]
    
    let relayPool = new RelayPool(relays);
    
    relayPool.onerror((err, relayUrl) => {
      console.log("RelayPool error", err, " from relay ", relayUrl);
    });
    relayPool.onnotice((relayUrl, notice) => {
      console.log("RelayPool notice", notice, " from relay ", relayUrl);
    });
    
    relayPool.subscribe(subFilter, relays, (event, isAfterEose, relayURL) => {
      // remember to parse the content
      let date = convertTimestamp(event.created_at)
      let parsedContent = JSON.parse(event.content)
      arr_content.unshift(parsedContent);
      arr_pubkeys.push(event.pubkey);
      arr_ids.push(event.id);
      arr_postDated.push(date)
    
      setContent(arr_content)
      setPubkey(arr_pubkeys);
      setIds(arr_ids);
      setCreationDate(arr_postDated)
    })
    
    
     setTimeout(() => {
      if(arr_content.length === 0) setBountyNotFound(true)
      relayPool.close().then(()=>{
        console.log('connection closed')
      })
      setLoading('not loading')
    }, 10000);
    
    },[iterator])
    
    useEffect(()=>{
      console.log(content)
      //console.log(pubkey)
      //console.log(ids)
      //console.log(creationDate)
    }, [content])


return(
    <div >
        <BountyCard content={content} metaData={pubkey} ids={ids} />
        {bountyNotFound ? <p>We didn't find any bounty, try with differente relays</p> : null}
        <button onClick={loadMoreContent}>{loading === 'loading' ? 'wait until it load' : 'load more content'}</button>
    </div>
)
}

export default bountyFeed