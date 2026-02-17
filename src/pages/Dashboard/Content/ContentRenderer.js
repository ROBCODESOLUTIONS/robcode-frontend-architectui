import React from 'react';
import TextContent from './components/TextContent';
import VideoContent from './components/VideoContent';
import GameContent from './components/GameContent';
import PdfContent from './components/PdfContent';

const contentComponents = {
  text: TextContent,
  video: VideoContent,
  game: GameContent,
  pdf: PdfContent,
};

const ContentRenderer = ({ content }) => {
  if (!content) {
    return <div className="alert alert-info">No hay contenido disponible</div>;
  }

  const Component = contentComponents[content.type] || (() => (
    <div className="alert alert-warning">
      Tipo '{content.type}' no implementado
    </div>
  ));

  return <Component content={content} />;
};

export default ContentRenderer;
