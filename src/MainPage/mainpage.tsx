import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { Post } from "./post";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

export const Main = () => {
  const postsRef = collection(db, "posts");

  // No vamos a usar ReactQuery ni ninguna herramienta para hacer querring porque Firebase ya viene con eso
  const [postsList, setPostLists] = useState<Post[] | null>(null);

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    console.log(data.docs.map((d) => ({ ...d.data(), id: d.id })));
    setPostLists(data.docs.map((d) => ({ ...d.data(), id: d.id })) as Post[]); // Acá se pone cómo se va a ver el dato
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      {postsList?.map((p) => (
        <Post post={p} />
      ))}
    </div>
  );
};
