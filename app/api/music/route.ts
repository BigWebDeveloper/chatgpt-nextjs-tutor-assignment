export async function GET() {
  const music = [
    {
      id: 1,
      title: "Jogodo",
      artist: "Asake & Wizkid",
    },
    {
      id: 2,
      title: "I Know Who I Be",
      artist: "Davido & JAZZWRLD",
    },
    {
      id: 3,
      title: "Chanel",
      artist: "Blaqbonez feat. Asake",
    },
    {
      id: 4,
      title: "Tornado",
      artist: "Ayra Starr",
    },
    {
      id: 5,
      title: "Back Outside",
      artist: "BNXN & Sarz",
    },
  ];

  return Response.json(music);
}
