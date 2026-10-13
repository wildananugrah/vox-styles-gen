import React from 'react';
import { Composition } from 'remotion';
import example from '../videos/creator-shortlist/content.json';
import { contentSchema, type Content } from './schema';
import { Texture, TEXTURE_SIZE, textureSchema } from './textures/Texture';
import { durationInFrames } from './timeline';
import { VoxVideo } from './VoxVideo';
import textbookExample from '../videos/serat-pangan/content.json';
import { contentSchema as textbookSchema, type TextbookContent } from './textbook/schema';
import { durationInFrames as textbookFrames } from './textbook/timeline';
import { TextbookVideo } from './textbook/TextbookVideo';
import paperExample from '../videos/serat-papercraft/content.json';
import { contentSchema as paperSchema, type PaperContent } from './papercraft/schema';
import { PaperVideo } from './papercraft/PaperVideo';
import collageExample from '../videos/yoris-kreatif/content.json';
import { contentSchema as collageSchema, type CollageContent } from './collage/schema';
import { durationInFrames as collageFrames } from './collage/timeline';
import { CollageVideo } from './collage/CollageVideo';

// Pick the video with --props=videos/<slug>/content.json (the npm scripts do this for you).
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="VoxVideo"
      component={VoxVideo}
      schema={contentSchema}
      defaultProps={example as Content}
      width={1080}
      height={1920}
      fps={24}
      durationInFrames={durationInFrames(example)}
      calculateMetadata={({ props }) => ({ fps: props.fps, durationInFrames: durationInFrames(props) })}
    />
    <Composition
      id="Textbook"
      component={TextbookVideo}
      schema={textbookSchema}
      defaultProps={textbookExample as TextbookContent}
      width={1080}
      height={1920}
      fps={24}
      durationInFrames={textbookFrames(textbookExample)}
      calculateMetadata={({ props }) => ({ fps: props.fps, durationInFrames: textbookFrames(props) })}
    />
    <Composition
      id="Papercraft"
      component={PaperVideo}
      schema={paperSchema}
      defaultProps={paperExample as PaperContent}
      width={1080}
      height={1920}
      fps={24}
      durationInFrames={textbookFrames(paperExample)}
      calculateMetadata={({ props }) => ({ fps: props.fps, durationInFrames: textbookFrames(props) })}
    />
    <Composition
      id="Collage"
      component={CollageVideo}
      schema={collageSchema}
      defaultProps={collageExample as CollageContent}
      width={1080}
      height={1350}
      fps={30}
      durationInFrames={collageFrames(collageExample)}
      calculateMetadata={({ props }) => ({ fps: props.fps, durationInFrames: collageFrames(props) })}
    />
    <Composition
      id="Texture"
      component={Texture}
      schema={textureSchema}
      defaultProps={{ name: 'paper' as const }}
      width={1080}
      height={1920}
      fps={1}
      durationInFrames={1}
      calculateMetadata={({ props }) => {
        const [width, height] = TEXTURE_SIZE[props.name];
        return { width, height };
      }}
    />
  </>
);
