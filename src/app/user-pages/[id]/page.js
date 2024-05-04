import styles from "./page.module.css";

import axios from "axios";
import { Suspense } from "react";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Module_Fullpage from "@/components/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/components/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/components/Module_Container/Module_Container";

// export async function generateMetadata({ params }) {
//   try {
//     const project = await axios.get(
//       `${process.env.API_URL}/projects/${params.id}?populate=tags`,
//       { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
//     );

//     const siteParameters = await axios.get(
//       `${process.env.API_URL}/site-parameter`,
//       {
//         headers: { authorization: `Bearer ${process.env.API_TOKEN}` },
//       }
//     );

//     const defaultTitle = siteParameters.data.data.attributes.pageTitle;
//     const projectTitle = project.data.data.attributes.title;
//     const titleStr = `${defaultTitle} || ${projectTitle}`;

//     const tagsArray = project.data.data.attributes.tags.data;
//     const tagsStr = tagsArray.map((tag) => tag.attributes.name).join(" | ");
//     const projectDescription = project.data.data.attributes.description;

//     const desciptionStr = projectDescription
//       ? `${projectDescription}\n${tagsStr}`
//       : tagsStr;

//     return {
//       title: titleStr,
//       description: desciptionStr,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// }

const fetchData = async (pageId) => {
  try {
    const page = await axios.get(
      `${process.env.API_URL}/pages/${pageId}?populate=modules.medias,modules.backgroundImage,modules.text`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const response = {
      page: {
        ...page.data.data.attributes,
      },
    };

    response.page.modules.forEach((module, i) => {
      response.page.modules[i].backgroundImage = module.backgroundImage
        ?.data && {
        ...module.backgroundImage.data.attributes,
        id: module.backgroundImage.data.id,
      };
      response.page.modules[i].medias = [...module.medias.data];

      response.page.modules[i].medias.forEach((media, j) => {
        response.page.modules[i].medias[j] = {
          ...media.attributes,
          id: media.id,
        };
      });
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default async function ProjectsIdPage({ params }) {
  const { page } = await fetchData(params.id);

  return (
    <Suspense>
      <ContentWrapper>
        {page.modules.map((module, index) => {
          switch (module.__component) {
            case "module.pleine-page":
              return <Module_Fullpage key={module.id} module={module} />;

            case "module.colonne-multi-images":
              return (
                <Module_MultiImagesColumn key={module.id} module={module} />
              );

            case "module.container":
              return <Module_Container key={module.id} module={module} />;

            default:
              break;
          }
        })}
      </ContentWrapper>
    </Suspense>
  );
}