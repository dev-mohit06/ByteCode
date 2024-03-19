import React from 'react'
import { Link } from 'react-router-dom';
import { formatDate } from '../common/date';

const AboutUser = ({bio,social_links,joinedAt,className = ""}) => {
  return (
    <div className={`${className} md:w-[90%] md:mt-7`}>
      <p>{bio.length ? bio : "Nothing to read here"}</p>

      <div className='flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey'>
        {
          Object.keys(social_links).map((key,i) => {
            let link = social_links[key];
            return link ? <Link to={social_links[key]} className='' target='_blank'>
              {
                key != "website"
                ?
                <i key={i} className={`fi fi-brands-${key}`}></i>
                :
                <i key={i} className={`fi fi-rr-globe`}></i>
              }
            </Link> : ""
          })
        }
      </div>

      <p className='text-xl leading-7 text-dark-grey'>Joined On - {formatDate(joinedAt)}</p>
    </div>
  )
}

export default AboutUser