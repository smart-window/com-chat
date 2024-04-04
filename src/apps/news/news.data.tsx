import * as React from 'react';
import { StaticImageData } from 'next/image';

import { SxProps } from '@mui/joy/styles/types';
import { Box, Chip, SvgIconProps, Typography } from '@mui/joy';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import LaunchIcon from '@mui/icons-material/Launch';

import { AnthropicIcon } from '~/common/components/icons/vendors/AnthropicIcon';
import { ChatBeamIcon } from '~/common/components/icons/ChatBeamIcon';
import { GroqIcon } from '~/common/components/icons/vendors/GroqIcon';
import { LocalAIIcon } from '~/common/components/icons/vendors/LocalAIIcon';
import { MistralIcon } from '~/common/components/icons/vendors/MistralIcon';
import { PerplexityIcon } from '~/common/components/icons/vendors/PerplexityIcon';

import { Brand } from '~/common/app.config';
import { Link } from '~/common/components/Link';
import { clientUtmSource } from '~/common/util/pwaUtils';
import { platformAwareKeystrokes } from '~/common/components/KeyStroke';


// Cover Images
// (not exactly) Imagine a futuristic, holographically bounded space. Inside this space, four capybaras stand. Three of them are in various stages of materialization, their forms made up of thousands of tiny, vibrant particles of electric blues, purples, and greens. These particles represent the merging of different intelligent inputs, symbolizing the concept of 'Beaming'. Positioned slightly towards the center and ahead of the others, the fourth capybara is fully materialized and composed of shimmering golden cotton candy, representing the optimal solution the 'Beam' feature seeks to achieve. The golden capybara gazes forward confidently, embodying a target achieved. Illuminated grid lines softly glow on the floor and walls of the setting, amplifying the futuristic aspect. In front of the golden capybara, floating, holographic interfaces depict complex networks of points and lines symbolizing the solution space 'Beaming' explores. The capybara interacts with these interfaces, implying the user's ability to control and navigate towards the best outcomes.
import coverV115 from '../../../public/images/covers/release-cover-v1.15.0.png';
// An image of a capybara sculpted entirely from iridescent blue cotton candy, gazing into a holographic galaxy of floating AI model icons (representing various AI models like Perplexity, Groq, etc.). The capybara is wearing a lightweight, futuristic headset, and its paws are gesturing as if orchestrating the movement of the models in the galaxy. The backdrop is minimalist, with occasional bursts of neon light beams, creating a sense of depth and wonder. Close-up photography, bokeh effect, with a dark but vibrant background to make the colors pop.
import coverV114 from '../../../public/images/covers/release-cover-v1.14.0.png';
// An image of a capybara sculpted entirely from black cotton candy, set against a minimalist backdrop with splashes of bright, contrasting sparkles. The capybara is using a computer with split screen made of origami, split keyboard and is wearing origami sunglasses with very different split reflections. Split halves are very contrasting. Close up photography, bokeh, white background.
import coverV113 from '../../../public/images/covers/release-cover-v1.13.0.png';
// An image of a capybara sculpted entirely from black cotton candy, set against a minimalist backdrop with splashes of bright, contrasting sparkles. The capybara is calling on a 3D origami old-school pink telephone and the camera is zooming on the telephone. Close up photography, bokeh, white background.
import coverV112 from '../../../public/images/covers/release-cover-v1.12.0.png';
import { beamBlogUrl, beamReleaseDate } from './beam.data';


interface NewsItem {
  versionCode: string;
  versionName?: string;
  versionMoji?: string;
  versionDate?: Date;
  versionCoverImage?: StaticImageData;
  text?: string | React.JSX.Element;
  items?: {
    text: React.ReactNode;
    dev?: boolean;
    issue?: number;
    icon?: React.FC<SvgIconProps>;
    noBullet?: boolean;
  }[];
}

// news and feature surfaces
export const NewsItems: NewsItem[] = [];


const wowStyle: SxProps = {
  textDecoration: 'underline',
  textDecorationThickness: '0.4em',
  textDecorationColor: 'rgba(var(--joy-palette-primary-lightChannel) / 1)',
  // textDecorationColor: 'rgba(0 255 0 / 0.5)',
  textDecorationSkipInk: 'none',
  // textUnderlineOffset: '-0.5em',
};

function B(props: {
  // one-of
  href?: string,
  issue?: number,
  code?: string,

  wow?: boolean,
  children: React.ReactNode
}) {
  const href =
    props.issue ? `${Brand.URIs.OpenRepo}/issues/${props.issue}`
      : props.code ? `${Brand.URIs.OpenRepo}/blob/main/${props.code}`
        : props.href;
  const isExtIcon = !props.issue;
  const boldText = (
    <Typography component='span' color={!!href ? 'primary' : 'neutral'} sx={{ fontWeight: 'lg' }}>
      {props.children}
    </Typography>
  );
  if (!href)
    return boldText;
  return (
    <Link href={href + clientUtmSource()} target='_blank' sx={props.wow ? wowStyle : undefined}>
      {boldText} {isExtIcon ? <LaunchIcon sx={{ mx: 0.5, fontSize: 16 }} /> : <AutoStoriesOutlinedIcon sx={{ mx: 0.5, fontSize: 16 }} />}
    </Link>
  );
}