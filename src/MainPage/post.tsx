import {
  addDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  doc,
} from "firebase/firestore";
import { Post as IPost } from "./mainpage";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: IPost;
}

interface Like {
  id: string;
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, "likes");

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(data.docs.map((d) => ({ userId: d.data().userId, id: d.id })));
  };

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes(
          likes
            ? [...likes, { userId: user.uid, id: newDoc.id }]
            : [{ userId: user.uid, id: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);

      if (user) {
        setLikes(likes?.filter((l) => l.id !== likeId) || null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((l) => l.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div>
      <div className="title">
        <h2>{post.title}</h2>
      </div>

      <div className="body">
        <p>{post.description}</p>
      </div>

      <div className="footer">
        <p>@{post.username}</p>
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}{" "}
        </button>
        <p>{likes && likes.length}</p>
      </div>

      <br />
    </div>
  );
};
