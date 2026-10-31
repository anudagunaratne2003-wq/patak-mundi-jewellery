export interface Concept {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** Large image shown on the left, inside the framed display. */
  image: string;
  /** Secondary image on the right — the piece worn / in context. */
  sideImage: string;
}

export const CONCEPTS: Concept[] = [
  {
    id: 'the-hive',
    title: 'House of the Bee',
    tagline: 'Nature, architecture at it’s finest',
    description:
      "The design, inspired by a honeycomb which is one of the amazing creations of nature.The design attempts to capture the natural architecture of the object and interpret it in an artistic manner.\nAdorned with an Ametrine stone 3.46ct, color defuced.\nThe design is silver finished and white gold plated.\nHandcrafted by the local craftsmen.",
    image:
      '/images/concepts/the-hive.jpg',
    sideImage:
     '/images/concepts/the-hive-side.jpg',
  },
  {
    id: 'the-serpent',
    title: 'Sands of Silver’',
    tagline: 'Milky waves on a silver sandy beach',
    description:
      'Design that represents your skin as the sandy beach and the aquamarine stone wrapped around in silvery waves, recreating a stunning incident of nature on your own skin.\nAdorned with 5.42 ct Natural Aqua Marine\nMined - Karawita, Rathnapura, SriLanka.\nSterling silver, white gold plated 4.68g (before plating)\nHandcrafted.',
     image:
      '/images/concepts/the-serpent.jpg',
    sideImage:
     '/images/concepts/the-serpent-side.jpg',
  },
  {
    id: 'celestial-veil',
    title: 'The Bubble Island',
    tagline: 'Avant summer sip cola art',
    description:
      'Adorned with brown tourmaline, this design offers a fresh perspective on a mundane scene. Inspired from a cluster of bubbles on a cola drink. As it could look like anything or any shape, the rest is up to the viewer to grasp.\n"You might never see your cola the same."',
     image:
      '/images/concepts/celestial-veil.jpg',
    sideImage:
     '/images/concepts/celestial-veil-side.jpg',
  },
  {
    id: 'root-and-branch',
    title: 'The Glacier Valley’',
    tagline: 'Be cool as a Glacier.',
    description:
      "Introducing the men's broach, adorned with 7.2ct aquamarine stone, finished with Sterling silver.\nThe designer broach is crafted to elevate your special wears, such as suits, into a one of a kind fashion icon, making you truly exceptional and ascending in your special events.\nA truly one of a kind jewelry such as this will only end up being a valued asset demanding honour at anywhere you enter.",
      image:
      '/images/concepts/root-and-branch.jpg',
    sideImage:
     '/images/concepts/root-and-branch-side.jpg',
  },
];
