import React from 'react';

const TextContent = ({ content }) => {
    return (
        <div className="content-text p-4">
            {content.body ? (
                <div dangerouslySetInnerHTML={{ __html: content.body }} />
            ) : (
                <p className="text-muted">Sin contenido de texto</p>
            )}
        </div>
    );
};

export default TextContent;