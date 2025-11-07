import React from "react";
import { searchUsers, getUserRepos } from "./services/githubService";
import { Button, Spinner } from "flowbite-react";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";

import type { UserSummary, Repo } from "./types/github";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Notification, { type Notification as NoteType } from "./components/Notification";

export default function Home() {
  const inputName = React.useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = React.useState("");
  const [maxData, setMaxData] = React.useState(0);
  const [users, setUsers] = React.useState<UserSummary[]>([]);
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [note, setNote] = React.useState<NoteType | null>(null);


  React.useEffect(() => {
    // keep ref stable; no teardown required for this simple example
  }, []);


  const onSearch = async () => {
    const query = inputName.current?.value ?? "";
    if (!query) return;
    try {
      setLoading(true);
      const items = await searchUsers(query);
      const slice = items.slice(0, 5);
      setMaxData(slice.length);
      setUsers(slice);
      setSearch(query);
    } catch (error) {
      setNote({ id: Date.now().toString(), type: "failure", title: "Search failed", message: String(error) });
    } finally {
      setLoading(false);
    }
  };
  const onRepo = async (login: string, index: number) => {
    try {
      const items = await getUserRepos(login);
      setRepos(items);
      setActiveIndex(index);
      setOpen((s) => !s);
    } catch (error) {
      setNote({ id: Date.now().toString(), type: "failure", title: "Load repos failed", message: String(error) });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="flex flex-col justify-center items-center p-5">
          <div className="">
            <div className="mt-10 flex flex-col">
              <input
                ref={inputName}
                type="text"
                placeholder="Enter username"
                className="w-[500px] text-black rounded-md"
              />
              <button
                onClick={() => {
                  onSearch();
                }}
                className="border mt-5 py-2 bg-sky-600 rounded-md font-semibold"
              >
                Search
              </button>
            </div>
            {search ? (
              <div className="flex justify-center mt-3 text-slate-600">
                Showing {maxData} users for "{search}"
              </div>
            ) : null}
          </div>
          {loading == true ? (
            <>
              <Button>
                <Spinner aria-label="Spinner button example" size="sm" />
                <span className="pl-3">Loading...</span>
              </Button>
            </>
          ) : (
            <div className="mt-5 flex flex-col gap-1">
              {users.map((value: UserSummary, index) => {
                return (
                  <div key={index} className="">
                    <button
                      onClick={() => {
                        onRepo(value.login, index);
                      }}
                      className="border w-[500px] rounded-md py-2"
                    >
                      <div className="flex justify-between items-center p-5">
                        <div className="flex items-center gap-3">
                          {value.avatar_url ? (
                            <img src={value.avatar_url} alt={value.login} className="w-10 h-10 rounded-full" />
                          ) : null}
                          <a href={value.html_url} target="_blank" rel="noreferrer" className="font-bold hover:underline">
                            {value.login}
                          </a>
                        </div>
                        <div>
                          <IoChevronDownOutline
                            className={`${open === true && index === activeIndex ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </button>
                    {open === true && index === activeIndex
                      ? repos.map((val: Repo, idx) => {
                        return (
                          <div className="border w-[500px] mt-2" key={idx}>
                            <div className="flex justify-between gap-3 w-full bg-slate-400">
                              <div className="flex flex-col gap-2 p-3">
                                <div className="flex gap-2">
                                  <a href={val.html_url} target="_blank" rel="noreferrer" className="font-bold hover:underline">
                                    {val.name}
                                  </a>
                                </div>
                                {val.description ? (
                                  <div className="flex justify-start font-medium text-justify">
                                    {val.description}
                                  </div>
                                ) : (
                                  <div className="flex justify-start font-medium">
                                    No Description
                                  </div>
                                )}
                              </div>
                              <div className="flex mt-3 justify-end p-3">
                                {val.stargazers_count}{" "}
                                <IoIosStarOutline size={25} />
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Notification note={note} />
    </>
  );
}
