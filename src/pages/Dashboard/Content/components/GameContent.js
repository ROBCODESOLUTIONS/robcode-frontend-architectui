import React from 'react';

const GameContent = ({ content }) => {
    return (
        <div className="content-game p-3">
            {content.body ? (
                <div className="ratio ratio-16x9 rounded shadow">
                    <iframe 
                        className='phaser-game' 
                        src={content.body}
                        width='100%' 
                        style={{ minHeight: '400px' }}
                        alt={content.title}
                        allowFullScreen/>
                </div>
            ) : (
                <div className="alert alert-warning">
                    <i className="fas fa-gamepad me-2"></i>
                    Juego no disponible
                </div>
            )}
        </div>
    );
};

export default GameContent;
