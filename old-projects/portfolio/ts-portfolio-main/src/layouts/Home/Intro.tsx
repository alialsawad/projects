import { DecoderText } from 'components/DecoderText';
import { Heading } from 'components/Heading';
import { Section } from 'components/Section';
import { useTheme } from 'components/ThemeProvider';
import { Transition } from 'components/Transition';
import { VisuallyHidden } from 'components/VisuallyHidden';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useState } from 'react';
import styles from './Intro.module.css';
import Specialization from './Specialization';

const GLSLHills = dynamic(() =>
  import('layouts/Home/GLSLHills').then(mod => mod.GLSLHills)
);

interface IntroProps {
  [key: string]: any;
  id: string;
  disciplines: string[];
}

export function Intro({ id, sectionRef, disciplines, ...rest }: IntroProps) {
  const theme = useTheme();
  const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
    ', and '
  );
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme.themeId} timeout={3000}>
        {(visible: boolean) => (
          <Fragment>
            <GLSLHills />

            <header className={styles.text}>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>
                  {`Software Engineer and ${introLabel}`}
                </VisuallyHidden>
                <span aria-hidden className={styles.row}>
                  <h1 className={styles.name} data-visible={visible} id={titleId}>
                    <DecoderText text="Ali Alsawad" delay={300} />
                  </h1>
                </span>
                <Specialization />
              </Heading>
            </header>
          </Fragment>
        )}
      </Transition>
    </Section>
  );
}
