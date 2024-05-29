import styles from "./ProjectsContainer.module.css";

// Components imports
import ProjectCard from "../ProjectCard/ProjectCard";
import ProjectCardsWrapper from "../ProjectCardsWrapper/ProjectCardsWrapper";

const ProjectsContainer = ({ projects, style, logos }) => {
  const totalGapWidth = (style.thumbnailsPerRow - 1) * style.gap;

  const projectCardWidthStr = `calc((100% - ${totalGapWidth}px) / ${style.thumbnailsPerRow})`;

  const cardsToDisplay = projects.map((project) => ({
    id: project.id,
    thumbnail: project.thumbnail,
    tags: project.tags,
    link: `/projects/${project.id}`,
    customStyles: {
      width: projectCardWidthStr,
      aspectRatio: "4/5",
    },
  }));

  if (logos.isVisible)
    cardsToDisplay.push({
      id: "logos-card",
      thumbnail: logos.thumbnail,
      tags: [],
      link: "/logos",
      customStyles: {
        backgroundColor: logos.thumbnailColor,
        right: "0px",
        bottom: "0px",
      },
    });

  return (
    <section className={styles.projectsContainer} id="projects-container">
      <ProjectCardsWrapper style={style} cardsToDisplay={cardsToDisplay}>
        {cardsToDisplay.map((card) => {
          return <ProjectCard key={card.id} cardData={card} />;
        })}
      </ProjectCardsWrapper>
    </section>
  );
};

export default ProjectsContainer;
