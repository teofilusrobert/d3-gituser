"use client"
import { useState } from 'react';
import axios from 'axios';
import styles from "./page.module.css";
import { marked } from 'marked';

type Repo = {
  id: number;
  name: string;
  full_name: string; 
  description: string | null; 
  html_url: string; 
  language: string | null; 
  fork: boolean; 
  stargazers_count: number;
  watchers_count: number;
  [key: string]: string | number | boolean | null; 
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [readmeContent, setReadmeContent] = useState('');

  const handleSearch = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`);
      setRepos(response.data);
      setReadmeContent('');
    } catch (error) {
      console.error('Error fetching repos:', error);
      alert('Could not fetch repositories for the specified user.');
    }
  };

  const fetchReadme = async (repoName:string) => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/readme`,
        { headers: { Accept: 'application/vnd.github.v3.raw' } }
      );
      setReadmeContent(response.data || '');
    } catch (error) {
      console.error('Error fetching README:', error);
      alert('Could not fetch README for the selected repository.');
    }
};

  return (
    <div className={styles.container}>
      <h1>GitHub User Repository Explorer</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>

      {repos.length > 0 && (
          <div>
            <br />
            <hr />
            <br />
            <h2>Repositories:</h2>
            <ul>
                {repos.map((repo) => (
                    <li key={repo.id}>
                        <button onClick={() => fetchReadme(repo.name)}>{repo.name}</button>
                    </li>
                ))}
            </ul>
          </div>
      )}

      {readmeContent && (
        <div className={styles.readme}>
          <h2>README:</h2>
          <div dangerouslySetInnerHTML={{ __html: marked(readmeContent || '') }}></div>
        </div>
      )}
    </div>
  );
}