const TemplateTag = ({ tag, onClick }) => {
    return (
        <button 
            className="tag-button px-3 py-1 mx-1 my-1 bg-gray-100 rounded-full text-sm text-gray-600"
            onClick={() => onClick && onClick(tag)}
        >
            {tag}
        </button>
    );
};

export default TemplateTag;