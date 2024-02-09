import * as React from 'react';
import { StaticImageData } from 'next/image';

import { SxProps } from '@mui/joy/styles/types';
import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/joy';
import LaunchIcon from '@mui/icons-material/Launch';

import { Brand } from '~/common/app.config';
import { Link } from '~/common/components/Link';
import { clientUtmSource } from '~/common/util/pwaUtils';
import { platformAwareKeystrokes } from '~/common/components/KeyStroke';

// Images
// An image of a capybara sculpted entirely from black cotton candy, set against a minimalist backdrop with splashes of bright, contrasting sparkles. The capybara is calling on a 3D origami old-school pink telephone and the camera is zooming on the telephone. Close up photography, bokeh, white background.
import coverV113 from '../../../public/images/covers/release-cover-v1.13.0.png';
import coverV112 from '../../../public/images/covers/release-cover-v1.12.0.png';


// update this variable every time you want to broadcast a new version to clients
export const incrementalVersion: number = 13;


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
  const boldText = (
    <Typography component='span' color={!!href ? 'primary' : 'neutral'} sx={{ fontWeight: 600 }}>
      {props.children}
    </Typography>
  );
  if (!href)
    return boldText;
  return (
    <Link href={href + clientUtmSource()} target='_blank' sx={props.wow ? wowStyle : undefined}>
      {boldText} <LaunchIcon sx={{ mx: 0.5, fontSize: 16 }} />
    </Link>
  );
}


// callout, for special occasions
export const newsRoadmapCallout =
  <Card variant='solid' invertedColors>
    <CardContent sx={{ gap: 2 }}>
      <Typography level='title-lg'>
        Open Roadmap
      </Typography>
      <Typography level='body-sm'>
        Take a peek at our roadmap to see what&apos;s in the pipeline.
        Discover upcoming features and let us know what excites you the most!
      </Typography>
      <Grid container spacing={1}>
        <Grid xs={12} sm={7}>
          <Button
            fullWidth variant='soft' color='primary' endDecorator={<LaunchIcon />}
            component={Link} href={Brand.URIs.OpenProject} noLinkStyle target='_blank'
          >
            Explore
          </Button>
        </Grid>
        <Grid xs={12} sm={5} sx={{ display: 'flex', flexAlign: 'center', justifyContent: 'center' }}>
          <Button
            fullWidth variant='plain' color='primary' endDecorator={<LaunchIcon />}
            component={Link} href={Brand.URIs.OpenRepo + '/issues/new?template=roadmap-request.md&title=%5BSuggestion%5D'} noLinkStyle target='_blank'
          >
            Suggest a Feature
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>;


interface NewsItem {
  versionCode: string;
  versionName?: string;
  versionMoji?: string;
  versionDate?: Date;
  versionCoverImage?: StaticImageData;
  text?: string | React.JSX.Element;
  items?: {
    text: string | React.JSX.Element;
    dev?: boolean;
    issue?: number;
  }[];
}

// news and feature surfaces
export const NewsItems: NewsItem[] = [];
