export interface GospelVideo {
  label: string;
  url?: string;
}

export interface GospelStory {
  date: string;
  name: string;
  bibleVerse?: string;
  videos: GospelVideo[];
}

export const GOSPEL_STORIES: GospelStory[] = [
  {
    date: 'January 4, 2026',
    name: 'The Finding of the Lord in the Temple',
    bibleVerse: 'Luke 2:41–52',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/DF1E2M6MCdc?feature=shared' }]
  },
  {
    date: 'January 11, 2026',
    name: 'Jesus’ Baptism',
    bibleVerse: 'John 1:29–34',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/F-MDVv6Yaf0?feature=shared' }]
  },
  {
    date: 'January 18, 2026',
    name: 'A Craft for Epiphany',
    videos: [{ label: 'Baptism of the Lord craft activity', url: 'https://www.sarajcreations.com/2018/01/baptism-of-lord-craft-idea.html' }]
  },
  {
    date: 'February 1, 2026',
    name: 'Sunday of the Righteous and the Just — Parable of the Sheep and the Goats',
    bibleVerse: 'Matthew 25:31–46',
    videos: [
      { label: 'Gospel story', url: 'https://www.youtube.com/watch?v=iWSkdx-XwWY' },
      { label: 'Pre-K–Grade 1 Sheep and Goats craft', url: 'https://www.youtube.com/watch?v=gG_O5XfSM6c' },
      { label: 'Lego video', url: 'https://www.youtube.com/watch?v=PY7TDL6S16Q' }
    ]
  },
  {
    date: 'February 8, 2026',
    name: 'Sunday of the Faithful Departed',
    bibleVerse: 'Luke 16:19–31 — The Rich Man and Lazarus',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/kS382rfB7po?si=C0WDpvX97TcSSdBm' }]
  },
  {
    date: 'February 15, 2026',
    name: 'Entrance to the Great Lent',
    bibleVerse: 'John 2:1–11',
    videos: [{ label: 'The Miracle of Cana', url: 'https://youtu.be/pCmKqDuuX-I?feature=shared' }]
  },
  {
    date: 'February 16, 2026',
    name: 'Ash Monday',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/tXs6qQ_o-lk?si=FFwqEBgYLGr-Osgv' }]
  },
  {
    date: 'February 22, 2026',
    name: 'The Healing of the Leper',
    bibleVerse: 'Mark 1:35–45',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/LzZUDRrKgI8?si=V9pjeRgd4MWcQUnk' }]
  },
  {
    date: 'March 1, 2026',
    name: 'Healing of the Hemorrhaging Woman',
    bibleVerse: 'Luke 8:40–56',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/h2x69EKYycY?si=bPQgcCL6_zIuPaE1' }]
  },
  {
    date: 'March 8, 2026',
    name: 'The Prodigal Son',
    bibleVerse: 'Luke 15:11–32',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/KLXSzuaX1Wc?si=hCRL510vcuduibk7' }]
  },
  {
    date: 'March 15, 2026',
    name: 'Healing of the Paralytic',
    bibleVerse: 'Mark 2:1–12',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/mfxTCr34mZI?si=SIz3zz39ygOImIQ_' }]
  },
  {
    date: 'March 22, 2026',
    name: 'Healing of the Blind Man',
    bibleVerse: 'Mark 10:46–52',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/Uo9ILFTVdhQ?si=7UKJMapjBdnmlMWt' }]
  },
  {
    date: 'Easter',
    name: 'Hosanna Sunday (Palm Sunday)',
    videos: [{ label: 'Easter video: The Way of the Cross', url: 'https://youtu.be/psX9ZXYHPOs' }]
  },
  {
    date: 'April 5, 2026',
    name: 'The Glorious Resurrection',
    bibleVerse: 'Matthew 28:1–10',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=TikWatDJGuk' }]
  },
  {
    date: 'April 12, 2026',
    name: '2nd Sunday of the Resurrection & Divine Mercy Sunday',
    bibleVerse: 'John 20:26–31',
    videos: [{ label: 'Doubting Thomas', url: 'https://youtu.be/pDC9SGGpn1U?feature=shared' }]
  },
  {
    date: 'April 19, 2026',
    name: '3rd Sunday of the Resurrection',
    bibleVerse: 'Luke 24:13–35',
    videos: [{ label: 'Road to Emmaus', url: 'https://www.youtube.com/watch?v=RI5mTW45MGA' }]
  },
  {
    date: 'April 26, 2026',
    name: '4th Sunday of the Resurrection',
    bibleVerse: 'John 21:1–14',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=Blj9KgHHB2M' }]
  },
  {
    date: 'May 3, 2026',
    name: '5th Sunday of the Resurrection',
    bibleVerse: 'John 21:15–19',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/QGYArgiWfMw?feature=shared' }]
  },
  {
    date: 'May 10, 2026',
    name: '6th Sunday of the Resurrection',
    bibleVerse: 'Luke 24:36–48',
    videos: [{ label: 'Gospel story (3:15)', url: 'https://www.youtube.com/watch?v=K3QkZsKLU2o' }]
  },
  {
    date: 'May 17, 2026',
    name: '7th Sunday of the Resurrection',
    bibleVerse: 'John 13:31–35',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=JeNtx1xhPAI' }]
  },
  {
    date: 'May 24, 2026',
    name: 'Pentecost Sunday',
    bibleVerse: 'Acts 2:1–21',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=HX4mx37ZZcw' }]
  },
  {
    date: 'May 31, 2026',
    name: 'Sunday of the Most Holy Trinity',
    bibleVerse: 'Matthew 28:16–20',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=97IL6CfQ6Xc' }]
  },
  {
    date: 'September 21, 2026',
    name: 'Jesus Teaches about Serving',
    bibleVerse: 'Mark 10:35–45',
    videos: [
      { label: 'Gospel story', url: 'https://youtu.be/itflsKx9HrI?si=z1bKxVtXiSrD3y08' },
      { label: 'Additional video', url: 'https://youtu.be/x1TI1nqHZcs?si=tWOd77kxslNXcpo0' }
    ]
  },
  {
    date: 'September 28, 2026',
    name: 'Building with Special Purpose',
    bibleVerse: 'Matthew 24:1–14',
    videos: [
      { label: 'Gospel story', url: 'https://www.youtube.com/watch?v=rnpiJsWpmTM' },
      { label: 'Song: Matthew 24:1–14', url: 'https://www.youtube.com/watch?v=2ad1hY3ccug&list=RD2ad1hY3ccug&start_radio=1' }
    ]
  },
  {
    date: 'October 4, 2026',
    name: 'Holy Rosary Sunday',
    bibleVerse: 'Matthew 24:23–31',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=bVLA_mhvXZ8' }]
  },
  {
    date: 'October 11, 2026',
    name: 'Faithful Servant',
    bibleVerse: 'Matthew 24:45–51',
    videos: [{
      label: 'Reflection for Kids — Gospel Matthew 24:42–51 (31 August 2023)',
      url: 'https://www.youtube.com/watch?v=ArHS0g-3PBA'
    }]
  },
  {
    date: 'October 18, 2026',
    name: 'The Parable of the Ten Virgins',
    bibleVerse: 'Matthew 25:1–13',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=t5odntAM8m0' }]
  },
  {
    date: 'October 25, 2026',
    name: 'Sunday of Christ the King',
    bibleVerse: 'Matthew 25:31–46',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=O3ZCSn6HtFg' }]
  },
  {
    date: 'November 1, 2025',
    name: 'Consecration of the Church',
    bibleVerse: 'Matthew 16:13–20',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=qf8RKf3HgFc' }]
  },
  {
    date: 'November 8, 2026',
    name: 'I Am the Good Shepherd',
    bibleVerse: 'John 10:22–42',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=QWH9IgeaK4U' }]
  },
  {
    date: 'November 15, 2026',
    name: 'Announcement to Zechariah',
    bibleVerse: 'Luke 1:1–25',
    videos: [{ label: 'Gospel story', url: 'https://www.youtube.com/watch?v=_CUPS10Wi48' }]
  },
  {
    date: 'November 22, 2026',
    name: 'Announcement to the Virgin Mary',
    bibleVerse: 'Luke 1:26–38',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/a1yOY62GFKU?feature=shared' }]
  },
  {
    date: 'December 6, 2026',
    name: 'Birth of John',
    bibleVerse: 'Luke 1:57–66',
    videos: [{ label: 'Gospel story', url: 'https://youtu.be/nsW8E9__pS8?feature=shared' }]
  },
  {
    date: 'December 13, 2026',
    name: 'Revelation to Joseph',
    bibleVerse: 'Matthew 1:18–25',
    videos: [{ label: 'Gospel story (1:45)', url: 'https://www.youtube.com/watch?v=XkEypzmHwCI' }]
  }
];
