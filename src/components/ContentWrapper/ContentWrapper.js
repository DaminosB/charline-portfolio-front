"use client";

import styles from "./ContentWrapper.module.css";

// React hooks imports
import { Children, useState, useEffect, useRef } from "react";

// Utils imports
import showElement from "@/utils/showElement";
import hideElement from "@/utils/hideElement";

// Components imports
import Logo from "../Logo/Logo";
import SectionWrapper from "../SectionWrapper/SectionWrapper";

// This wrapper sets its children to be displayed by a slider div that will translate to show the active part
const ContentWrapper = ({ children, style, profile }) => {
  // Children are displayed one at a time with a full page effect
  // style: Object. The style informations got through a request to the back
  // profile: Object. The profile informations got through a request to the back

  // This state tells which children needs to be displayed
  const [activeIndex, setActiveIndex] = useState(0);

  // This ref will be used to translate the content through a display window
  const sliderRef = useRef(null);

  // This ref stores the way the cover is displayed
  const coverIsShown = useRef(true);

  // This func translates the content at every activeIndex change
  useEffect(() => {
    const element = sliderRef.current;

    // Header is not shown when not on 1st child (cover)
    const headerNode = Array.from(element.parentNode.parentNode.children).find(
      (child) => child.tagName === "HEADER"
    );

    const activeSectionTopPosition = element.children[activeIndex].offsetTop;

    // Index 0 has a special treatment
    const coverComponent = element.children[0];

    switch (activeIndex) {
      case 0:
        // If activeChild is the cover, we need to check if it's displayed normaly. If so, nothing happens.
        if (!coverIsShown.current) {
          // If not, we set the standard display parameters
          coverComponent.style.scale = 1;
          coverComponent.style.height = "100%";
          showElement(coverComponent);

          // And show the header
          showElement(headerNode);

          // We also slide to the cover component
          element.style.transform = `translateY(${-activeSectionTopPosition}px)`;

          // Then we indicate the cover is normaly displayed
          coverIsShown.current = true;
        }
        break;

      case 1:
        // If we are on the 2nd child, we also need to check if the cover is displayed normaly
        if (coverIsShown.current) {
          // If so, we reduce its size and opacity
          coverComponent.style.scale = 0.8;
          coverComponent.style.height = "0%";
          hideElement(coverComponent);

          // The header also disappears
          hideElement(headerNode);

          // Then we indicate the cover is not shown anymore
          coverIsShown.current = false;
        } else {
          // If not, we just slide the active child
          element.style.transform = `translateY(${-activeSectionTopPosition}px)`;
        }
        break;

      default:
        // All other scenarios, we slide normaly
        element.style.transform = `translateY(${-activeSectionTopPosition}px)`;
        break;
    }
  }, [activeIndex]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <main className={styles.contentWrapper} id="content-wrapper">
      {/* The logo is used as a link to slide the content to the 1st child */}
      <Logo
        logo={profile.logo}
        style={style}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      {/* The slider wraps all the children and is translated to show the active child through the ContentWrapper display window */}
      <div className={styles.slider} ref={sliderRef}>
        {/* We make a .map func in order to wrap each section in a component that will handle activeIndex changes */}
        {Children.map(children, (child, index) => {
          return (
            <SectionWrapper
              setActiveIndex={setActiveIndex}
              numberOfSiblings={children.length}
              index={index}
              style={style}
            >
              {child}
            </SectionWrapper>
          );
        })}
      </div>
    </main>
  );
};

export default ContentWrapper;
