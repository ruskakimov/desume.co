import {
  doc,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import React, { createContext, useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore } from "../../api/firebase-setup";
import { useUserContext } from "../../App";

export interface Correction {
  original: string;
  corrected: string;
}

export interface Review {
  corrections: Correction[];
  correct: string[];
}

interface ReviewState {
  review?: Review;
  isLoading: boolean;
  error?: string;
}

const converter: FirestoreDataConverter<Review> = {
  toFirestore(data: Review): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Review {
    const data = snapshot.data();
    return data as Review;
  },
};

const ReviewContext = createContext<ReviewState>({ isLoading: false });

export function useReview(): ReviewState {
  return useContext(ReviewContext);
}

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUserContext();
  const [review, isLoading, error] = useDocumentData<Review>(
    doc(firestore, "reviews", user.uid).withConverter(converter)
  );

  return (
    <ReviewContext.Provider
      value={{ review, isLoading, error: error?.message }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
