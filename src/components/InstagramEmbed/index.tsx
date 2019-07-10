import React from 'react';

function InstagramEmbed(props: { url: string }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={props.url}
      data-instgrm-version="12"
    >
      <a href={props.url} />
    </blockquote>
  );
}

export default InstagramEmbed;
