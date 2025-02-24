import React, { useState, useEffect } from "react";
import "./HomePage.css";
import campuscollab from "../assets/campuscollab3.jpeg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import projectImage from "../assets/projectImage.png";
const HomePage = ({ users }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState();
  const [project, setProject] = useState();
  const id = localStorage.getItem("userId");
  const [filteredUser, setFilteredUser] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const fetchProjects = async () => {
    try {
      const url = `http://localhost:8000/projects/myprojects/${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      setProjects(result.projects);
    } catch (error) {
      console.log(error);
    }
  };

  function handleSearchUser() {
    if (!searchQuery) {
      return alert("First enter the username");
    }
    navigate(`/campuscollab/search?q=${searchQuery}`);
  }

  const handleClick = (e) => {
    setProject(e);
  };
  const handleCancel = () => {
    setProject();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  console.log(projects);
  return (
    <div className="homepage">
      <div className="search-user">
        <input
          type="text"
          placeholder="Search user"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearchUser();
            }
          }}
        />
        <button onClick={handleSearchUser}>
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
      <div className="homepage_first_component">
        <div className="homepage_first_section">
          <h1>Deploy and Showcase your projects</h1>
          <p>
            Campus Collab is a platform designed for students to showcase and
            deploy their projects, fostering collaboration and innovation. It
            offers an easy-to-use interface to upload, manage, and display
            student work, empowering the community to share knowledge and grow
            together.
          </p>
          <div className="homepage_first_project_section">
            <Link to={"/addprojects"}>
              <button>Add New Project</button>
            </Link>
            <Link to={"/myprojects"}>
              <button>My Projects</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="homepage_second_component">
        <h1>Latest Projects</h1>
        <div className="latest-projects">
          {!projects ? (
            <div className="loading"></div>
          ) : Array.isArray(projects) && projects.length > 0 ? (
            projects.slice(0, 5).map((project, index) => (
              <Link>
                <ul
                  key={index}
                  className="projects"
                  onClick={() => handleClick(project)}
                >
                  <div className="project-image-title">
                    {project && project.image ? (
                      <img
                        src={`http://localhost:8000/uploads/${project.image
                          .replace(/\\/g, "/")
                          .replace(/^uploads\//, "")}`}
                        alt=""
                      />
                    ) : (
                      <img src={projectImage} alt="" />
                    )}
                  </div>
                  <div className="project-name">    
                    <h3>{project.name}</h3>
                  </div>

                  <div className="project-domain">
                    <h3>{project.domain}</h3>
                  </div>
                  <div className="project-description">
                    <p>{project.description.slice(0, 60)}...</p>
                  </div>
                  <div className="projects-arrow">
                    <Link to={`/project/${project._id}`}>
                      <i class="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </ul>
              </Link>
            ))
          ) : (
            <h1 style={{ textAlign: "center" }}>No project available</h1>
          )}{" "}
          {project ? (
            <div className="project">
              <div className="project-information">
                <div className="project-details">
                  <h3>
                    <u>Project Name</u>: <strong>{project.name}</strong>
                  </h3>
                  <h3>
                    <u>Project domain</u>: <strong>{project.domain}</strong>
                  </h3>
                  {project.developer === "" ? (
                    project.developers &&
                    Object.values(project.developers).map((developer, index) =>
                      developer.trim() !== "" ? (
                        <div className="project-developers">
                          <h3>
                            Team Member : <strong>{developer}</strong>{" "}
                          </h3>
                        </div>
                      ) : (
                        ""
                      )
                    )
                  ) : (
                    <h3>
                      <u>Project developer</u>:{" "}
                      <strong>{project.developer}</strong>
                    </h3>
                  )}
                  <h3>
                    <u>Project description</u>:{" "}
                    <strong>{project.description}</strong>
                  </h3>
                  <Link to={`/project/${project._id}`}>
                    <a href="/project">See more...</a>
                  </Link>
                </div>
                {/* <div className="project-see-more">
                                        <Link to={'/project'}>see more...</Link>
                                    </div> */}
                <div className="cancel-button">
                  <i onClick={handleCancel} class="fa-solid fa-x"></i>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
