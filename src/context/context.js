import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

export const GithubContext = React.createContext();

const GithubProvider = GithubContext.Provider;

export const GithubProviderFunc = (props) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [githubRepos, setGithubRepos] = useState(mockRepos);
  const [githubFollowers, setGithubFollowers] = useState(mockFollowers);

  // request loading
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  // error
  const [error, setError] = useState({ show: false, message: "" });

  // search github user
  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    // fetchUser
    let value = await fetchUser(user);
    return value;
  };

  const fetchUser = async (user) => {
    console.log("fetching");
    try {
      const { data } = await axios(`${rootUrl}/users/${user}`);
      if (data) {
        setGithubUser(data);
        const { login, followers_url } = data;
        // repos
        await fetchRepo(login);
        // followers
        await fetchFollowers(followers_url);
      }
      return true;
    } catch (error) {
      toggleError(true, "there is no user with this user name");
      console.log(error.message);
      setLoading(false);
      return false;
    }
  };

  const fetchRepo = async (login) => {
    try {
      let { data } = await axios(
        `${rootUrl}/users/${login}/repos?per_page=100`
      );

      setGithubRepos(data);
    } catch (error) {
      toggleError(true, "repo not found");
    }
  };

  const fetchFollowers = async (followers_url) => {
    try {
      let { data } = await axios(`${followers_url}`);
      setGithubFollowers(data);
      setLoading(false);
    } catch (error) {
      toggleError(true, "Followers not found");
    }
  };

  // check rate
  const checkRequest = async () => {
    try {
      let { data } = await axios(`${rootUrl}/rate_limit`);
      let {
        rate: { remaining },
      } = data;
      setRequest(remaining);

      if (remaining === 0) {
        toggleError(true, "sorry you have exceeded your hourly rate limit!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // error
  function toggleError(show = false, message = "") {
    setError({ show, message });
  }

  useEffect(() => {
    checkRequest();
  });
  return (
    <GithubProvider
      value={{
        githubUser,
        githubRepos,
        githubFollowers,
        request,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {props.children}
    </GithubProvider>
  );
};
