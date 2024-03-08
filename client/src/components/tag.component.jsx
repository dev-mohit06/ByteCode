import { useContext, useState } from 'react'
import BlogContext from '../common/blog-context';
import {toast} from 'react-hot-toast';

const Tag = ({ tag }) => {

  const { state:{tags:{tag_list}},dispatch } = useContext(BlogContext);
  const [initialState,setIinitialState] = useState(tag);

  const findTagIndex = () => {
    let index = tag_list.indexOf(initialState);
    return index;
  }

  const handelTagSubmit = (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      let tag = e.target.innerText.toLowerCase();
      console.log(tag);

      if (!tag) {
        toast.error('Tag is required!');
        return;
      }

      if (tag_list.includes(tag)) {
        toast.error(`Tag ${tag} already exsist!`);
        return;
      }

      tag_list[findTagIndex()] = tag;

      setIinitialState(tag);
      dispatch({
        type: 'SET_TAGS',
        payload: {
          tag_list: tag_list
        }
      });
      toast.success('tag updated successfully 👍');
      e.target.blur();
    }
  }

  const handleTagDelete = () => {
    tag_list.pop(findTagIndex());
    dispatch({
      type: 'SET_TAGS',
      payload: {
        tag_list: tag_list
      }
    });
    toast.success('tag deleted successfully 👍');
  }

  return (
    <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8'>
      <p className='outline-none' contentEditable="true" suppressContentEditableWarning={true} onKeyDown={handelTagSubmit}>{initialState}</p>
      <button className='mt-[2px] rounded-none absolute right-3 top-1/2 -translate-y-1/2' onClick={handleTagDelete}>
        <i className="fi fi-rr-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  )
}
export default Tag;