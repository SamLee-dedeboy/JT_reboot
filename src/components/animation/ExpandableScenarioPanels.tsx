import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Typography } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface ExpandableScenarioPanelItem {
  title: string;
  image: string;
  eyebrow?: string;
  body?: string;
  href?: string;
}

interface ExpandableScenarioPanelsProps {
  items: ExpandableScenarioPanelItem[];
  actionLabel?: string;
  header?: ReactNode;
  sharedImage?: boolean;
  collapseOnScroll?: boolean;
}

export default function ExpandableScenarioPanels({
  items,
  actionLabel = 'Enter',
  header,
  sharedImage = false,
  collapseOnScroll = false,
}: ExpandableScenarioPanelsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const collapsedHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['100dvh', '15dvh'],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.35],
    [1, 0],
  );
  const panelHeight = collapseOnScroll
    ? '100dvh'
    : { xs: 'calc(100svh - 72px)', md: 'calc(100svh - 76px)' };

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        height: collapseOnScroll ? '200dvh' : 'auto',
        minHeight: collapseOnScroll ? 0 : panelHeight,
        bgcolor: collapseOnScroll ? 'base.800' : 'base.900',
      }}
    >
      <Box
        sx={{
          position: collapseOnScroll ? 'sticky' : 'relative',
          top: 0,
          height: panelHeight,
          bgcolor: 'base.800',
          overflow: 'hidden',
        }}
      >
        {header && (
          <motion.div
            style={collapseOnScroll ? { opacity: contentOpacity } : undefined}
          >
            <Box
              sx={{
                position: 'absolute',
                zIndex: 3,
                top: { xs: 24, md: 32 },
                left: { xs: 20, md: 36 },
                right: { xs: 20, md: 36 },
                pointerEvents: 'none',
              }}
            >
              {header}
            </Box>
          </motion.div>
        )}

        <motion.div
          style={{
            height: collapseOnScroll ? collapsedHeight : '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            component="ul"
          sx={{
              m: 0,
              p: 0,
              height: '100%',
              display: 'flex',
              flexDirection: collapseOnScroll ? 'row' : { xs: 'column', md: 'row' },
              listStyle: 'none',
          }}
        >
        {items.map((item, index) => (
          <Box
            component="li"
            key={item.title}
            tabIndex={0}
            sx={{
              position: 'relative',
              flex: { xs: '1 1 15rem', md: '1 1 0' },
              minWidth: 0,
              height: collapseOnScroll ? '100%' : 'auto',
              minHeight: collapseOnScroll ? 0 : { xs: '15rem', md: 'calc(100svh - 76px)' },
              isolation: 'isolate',
              overflow: 'hidden',
              borderRight: { xs: 0, md: '1px solid rgba(126,217,87,0.3)' },
              borderBottom: { xs: '1px solid rgba(126,217,87,0.3)', md: 0 },
              transition: 'flex 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 240ms ease',
              outline: 'none',
              '&:hover, &:focus-within, &:focus-visible': {
                flex: { xs: '1.6 1 18rem', md: '2.45 1 0' },
                '& .expandable-panel-image': {
                  transform: 'scale(1.05)',
                  opacity: 0.9,
                },
                '& .expandable-panel-body, & .expandable-panel-action': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
                '&::after': {
                  opacity: 0,
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                zIndex: -1,
                border: '2px solid rgba(126,217,87,0.64)',
                opacity: 0.75,
                boxShadow: 'inset 0 0 34px rgba(126,217,87,0.12)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                zIndex: -1,
                opacity: 0.75,
                background: 'linear-gradient(180deg, rgba(16,22,24,0.42) 0%, rgba(16,22,24,0.3) 42%, rgba(16,22,24,0.5) 100%)',
                transition: 'opacity 260ms ease',
                pointerEvents: 'none',
              },
            }}
          >
            {sharedImage ? (
              <Box
                className="expandable-panel-image"
                role="img"
                aria-label=""
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: -3,
                  opacity: 0.76,
                  transform: 'scale(1)',
                  transformOrigin: 'center',
                  backgroundImage: `url(${item.image})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: { xs: 'cover', md: `${items.length * 100}% 100%` },
                  backgroundPosition: {
                    xs: 'center',
                    md: `${items.length === 1 ? 50 : (index / (items.length - 1)) * 100}% center`,
                  },
                  transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease',
                }}
              />
            ) : (
              <Box
                component="img"
                className="expandable-panel-image"
                src={item.image}
                alt=""
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: -3,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.76,
                  transform: 'scale(1)',
                  transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease',
                }}
              />
            )}
            <motion.div style={collapseOnScroll ? { opacity: contentOpacity } : undefined}>
              <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: -2,
                background: 'linear-gradient(180deg, rgba(16,22,24,0.78) 0%, rgba(16,22,24,0.22) 20%, rgba(16,22,24,0) 38%, rgba(16,22,24,0) 62%, rgba(16,22,24,0.24) 80%, rgba(16,22,24,0.9) 100%)',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                left: { xs: 20, md: 24 },
                right: { xs: 20, md: 24 },
                bottom: { xs: 28, md: 72 },
                minHeight: { xs: 'auto', md: 300 },
                display: 'grid',
                gridTemplateRows: {
                  xs: 'auto',
                  md: '1rem 5.6rem 7.6rem 3.6rem',
                },
                alignContent: 'end',
                justifyItems: 'start',
                gap: { xs: 1.15, md: 1.1 },
                textAlign: 'left',
              }}
            >
              <Typography variant="numberArticle" component="p" sx={{ color: 'primary.main', alignSelf: 'start' }}>
                {item.eyebrow ?? String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  maxWidth: '12ch',
                  color: 'common.white',
                  minHeight: { xs: 'auto', md: '5.4rem' },
                  display: { xs: 'block', md: 'flex' },
                  alignItems: { md: 'flex-start' },
                }}
              >
                {item.title}
              </Typography>
              {item.body && (
                <Typography
                  className="expandable-panel-body"
                  variant="body2"
                  sx={{
                    maxWidth: '36ch',
                    color: 'base.100',
                    maxHeight: { xs: 'none', md: '7.6rem' },
                    overflow: 'hidden',
                    opacity: { xs: 1, md: 0 },
                    transform: { xs: 'translateY(0)', md: 'translateY(10px)' },
                    transition: 'opacity 220ms ease, transform 220ms ease',
                    alignSelf: 'start',
                    justifySelf: 'start',
                  }}
                >
                  {item.body}
                </Typography>
              )}
              {item.href && (
                <Button
                  className="expandable-panel-action"
                  component={Link}
                  to={item.href}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    justifySelf: 'start',
                    alignSelf: 'end',
                    color: 'common.white',
                    borderColor: 'rgba(126,217,87,0.7)',
                    bgcolor: 'rgba(126,217,87,0.08)',
                    opacity: { xs: 1, md: 0 },
                    transform: { xs: 'translateY(0)', md: 'translateY(10px)' },
                    transition: 'opacity 220ms ease, transform 220ms ease, border-color 180ms ease, background-color 180ms ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(126,217,87,0.14)',
                    },
                  }}
                >
                  {actionLabel}
                </Button>
              )}
            </Box>
            </motion.div>
          </Box>
        ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
