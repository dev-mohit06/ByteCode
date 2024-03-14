import React from 'react';

const Img = ({ url, caption }) => {
    return (
        <div>
            <img src={url} alt={caption} />
            {caption.length ? <p className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'>{caption}</p> : ""}
        </div>
    )
}

const Quote = ({ quote, caption }) => {
    return (
        <div className='bg-purple/10 p-3 pl-5 border-l-4 border-purple'>
            <p className='text-xl leading-10 md:text-2xl'>{quote}</p>
            {caption.length ? <p className='w-full text-purple text-base'>{caption}</p> : ""}
        </div>
    )
}

const List = ({ style, items }) => {
    return (
        <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
            {
                items.map((item, i) => {
                    return <li key={i} className='my-4' dangerouslySetInnerHTML={{ __html: item }}></li>
                })
            }
        </ol>
    )
}

const Delimiter = () => {
    return <hr className="my-6 border-gray-200" />;
};

const InlineCode = ({ code }) => {
    return <code className="bg-gray-200 p-1 rounded-md">{code}</code>;
};

const BlogContent = ({ block }) => {
    const { type, data } = block;

    if (type === 'paragraph') {
        return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
    }

    if (type === 'header') {
        const HeaderTag = `h${data.level}`;
        return <HeaderTag className="font-bold text-xl my-4">{data.text}</HeaderTag>;
    }

    if (type === 'image') {
        return <Img url={data.file.url} caption={data.caption} />;
    }

    if (type === 'quote') {
        return <Quote quote={data.text} caption={data.caption} />;
    }

    if (type === 'list') {
        return <List style={data.style} items={data.items} />;
    }

    // Handle any other block types here

    return null; // Return null for unsupported block types
};

export default BlogContent;