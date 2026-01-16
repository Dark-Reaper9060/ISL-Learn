export interface ISLAlphabet {
  letter: string;
  image: string;
  description: string;
  tips: string[];
}

export const islAlphabets: ISLAlphabet[] = [
  { letter: "A", image: "/isl_img/A.jpg", description: "Make a fist with thumb resting on the side", tips: ["Keep fingers tight", "Thumb outside"] },
  { letter: "B", image: "/isl_img/B.jpg", description: "Flat hand with fingers together, thumb tucked", tips: ["Fingers straight up", "Palm facing forward"] },
  { letter: "C", image: "/isl_img/C.jpg", description: "Curved hand forming a 'C' shape", tips: ["Fingers together", "Natural curve"] },
  { letter: "D", image: "/isl_img/D.jpg", description: "Index finger up, others curled with thumb touching", tips: ["Index straight", "Circle with other fingers"] },
  { letter: "E", image: "/isl_img/E.jpg", description: "Fingers curled, thumb tucked under", tips: ["Tight curl", "Palm facing out"] },
  { letter: "F", image: "/isl_img/F.jpg", description: "Thumb and index touching, others extended", tips: ["Make an 'OK' sign", "Three fingers up"] },
  { letter: "G", image: "/isl_img/G.jpg", description: "Index and thumb pointing, others curled", tips: ["Like pointing sideways", "Thumb parallel to index"] },
  { letter: "H", image: "/isl_img/H.jpg", description: "Index and middle fingers extended horizontally", tips: ["Fingers together", "Point sideways"] },
  { letter: "I", image: "/isl_img/I.jpg", description: "Pinky finger extended, others in fist", tips: ["Only pinky up", "Fist tight"] },
  { letter: "J", image: "/isl_img/J.jpg", description: "Pinky traces a 'J' in the air", tips: ["Start with I position", "Draw J motion"] },
  { letter: "K", image: "/isl_img/K.jpg", description: "Index and middle up in V, thumb between", tips: ["Like V with thumb", "Palm forward"] },
  { letter: "L", image: "/isl_img/L.jpg", description: "L-shape with thumb and index at right angle", tips: ["Clear right angle", "Other fingers curled"] },
  { letter: "M", image: "/isl_img/M.jpg", description: "Three fingers over thumb, fingers down", tips: ["Thumb under three fingers", "Knuckles visible"] },
  { letter: "N", image: "/isl_img/N.jpg", description: "Two fingers over thumb, fingers down", tips: ["Thumb under two fingers", "Similar to M"] },
  { letter: "O", image: "/isl_img/O.jpg", description: "Fingers and thumb form a circle", tips: ["Round shape", "Fingertips touching thumb"] },
  { letter: "P", image: "/isl_img/P.jpg", description: "Like K but pointing downward", tips: ["Wrist bent down", "Same handshape as K"] },
  { letter: "Q", image: "/isl_img/Q.jpg", description: "Like G but pointing downward", tips: ["Index and thumb down", "Wrist bent"] },
  { letter: "R", image: "/isl_img/R.jpg", description: "Index and middle crossed", tips: ["Fingers intertwined", "Others curled"] },
  { letter: "S", image: "/isl_img/S.jpg", description: "Fist with thumb across fingers", tips: ["Thumb in front", "Tight fist"] },
  { letter: "T", image: "/isl_img/T.jpg", description: "Thumb between index and middle, in fist", tips: ["Thumb peeking out", "Fist formation"] },
  { letter: "U", image: "/isl_img/U.jpg", description: "Index and middle together, extended up", tips: ["Two fingers together", "Pointing up"] },
  { letter: "V", image: "/isl_img/V.jpg", description: "Index and middle spread apart, extended", tips: ["Victory sign", "Palm forward"] },
  { letter: "W", image: "/isl_img/W.jpg", description: "Three fingers (index, middle, ring) spread", tips: ["Three fingers up", "Spread apart"] },
  { letter: "X", image: "/isl_img/X.jpg", description: "Index finger hooked/bent", tips: ["Crooked finger", "Others in fist"] },
  { letter: "Y", image: "/isl_img/Y.jpg", description: "Thumb and pinky extended, others curled", tips: ["Hang loose sign", "Thumb out, pinky out"] },
  { letter: "Z", image: "/isl_img/Z.jpg", description: "Index finger traces 'Z' in air", tips: ["Zigzag motion", "Start with index pointing"] },
];

export const getAlphabetByLetter = (letter: string): ISLAlphabet | undefined => {
  return islAlphabets.find(a => a.letter === letter.toUpperCase());
};
