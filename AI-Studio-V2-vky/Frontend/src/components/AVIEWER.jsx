import React from "react";

const OpenInDevEnv = () => {
  
  const GITHUB_REPO_URL = "https://github.com/Vikrantthakur64/RAG_Application_Kit";

  const openStackBlitz = () => {
    window.open(
      `https://stackblitz.com/fork/github/${GITHUB_REPO_URL.replace(
        "https://github.com/",
        ""
      )}`,
      "_blank"
    );
  };

  const openCodeSandbox = () => {
    window.open(
      `https://codesandbox.io/s/github/${GITHUB_REPO_URL.replace(
        "https://github.com/",
        ""
      )}`,
      "_blank"
    );
  };

  const openGitpod = () => {
    window.open(
      `https://gitpod.io/#${GITHUB_REPO_URL}`,
      "_blank"
    );
  };

  return (
    <div>
      <button onClick={openStackBlitz}>
        Open in StackBlitz
      </button>

      <br />
      <br />

      <button onClick={openCodeSandbox}>
        Open in CodeSandbox
      </button>

      <br />
      <br />

      <button onClick={openGitpod}>
        Open in Gitpod
      </button>
    </div>
  );
};

export default OpenInDevEnv;
