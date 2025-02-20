import { useNavigate, Link } from "react-router-dom";

import { getNpub } from "../../../utils";

import bitcoinIcon from "../../../assets/bitcoin-icon.png";
import avatarImage from "../../../assets/avatarImg.png";

type props = {
  title: string;
  reward: string;
  id: string;
  dates: string;
  pubkeys: string;
  name:string,
  picture:string
};

function ShortBountyInfo({ title, reward, id, dates, pubkeys, name, picture }: props) {
  const navigate = useNavigate();

  let bountyInfoPath = `/b/${id}`;
  let bountyPosterPath = `/profile/${pubkeys}`;
  let npub = getNpub(pubkeys);
  return (
    <div>
      <div className="my-2 justify-between items-center flex shadow-md border border-gray-200 rounded-md max-w-7xl hover:bg-input-bg-dm lg:mx-5 px-15  sm:flex-wrap px-5 py-3 mx-4 dark:bg-sidebar-bg">
        <div onClick={()=> navigate(bountyInfoPath)} className="basis-6/12 cursor-pointer sm:basis-10/12">
          <p className="font-sans text-base font-medium dark:text-gray-1">
            {title}
          </p>
          <div className="flex flex-wrap">
            <img
              className="w-4 h-4 rounded-full my-1 mx-0.5"
              src={bitcoinIcon}
              alt="bitcoin image"
            ></img>
            <p className="font-sans text-sm text-dark-text font-normal mr-1 mt-0.5 dark:text-gray-1">
              {reward} sats
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between ">
          <div className="flex flex-wrap">
          <div className="flex mr-2 my-2">
                <Link
                  to={bountyPosterPath}
                  className="font-sans text-sm font-light underline dark:text-gray-1"
                >
                  by {name === '' || undefined ? npub : name}
                </Link>
                <img
                  className="w-6 h-6 rounded-full shadow-lg ml-2"
                  src={
                    picture === '' || undefined ? avatarImage : picture
                  }
                  alt="avatar image"
                />
              </div>
          </div>
          <div className="mt-2">
            <span className="font-sans text-sm font-light  dark:text-gray-1">
              {dates}
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ShortBountyInfo;
