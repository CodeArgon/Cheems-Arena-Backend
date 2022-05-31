import { MintList } from "../models/mint_list.js";
import { User } from "../models/users.js";
import { God } from "../models/gods.js";

const createMintList = async () => {
  const mint_list = [
    { id: 1, mint: "GCwvj1BNFMQpNJD4iKrDT2tLVmsjzYirNTPSX8qotJio" },
    { id: 2, mint: "DTFPNFNJupq4yXJNMEYzK9BnFc9zWuFoxV1PvMC1gfB9" },
    { id: 3, mint: "2gZW4FzsqmotKHK33bd7bMmJ6DxnZYEdxSBw1DvxcRP1" },
    { id: 4, mint: "6hqmSUYnnLbJdcwwpZQd2Jsd32wU7g4syxJP5UqbH57B" },
    { id: 5, mint: "2UHKLN7JSVXgYSvYGFWSDchEr7eagfwr7bKd17Vcynr6" },
    { id: 6, mint: "FfhKV5XCCrxbXzn4MF81y74Qgb5oQzoWwrdCFJMKuJES" },
    { id: 7, mint: "GxRjjfwmKcMK9yPHGUT5Zbz3rJXDBdaWpwxorMBTScvV" },
    { id: 8, mint: "toSTzu81mtng2ssTTQiJXor3DGVyVnpFrQP5UXBqYMM" },
    { id: 9, mint: "GzuEoSVcJBp7edEGif6zojDhGn6AuExuqWL4P23gHUz2" },
    { id: 10, mint: "GAr2zW3t5BWGeTZg93URaqyWw1RocG1MjkQi8N5FdKCF" },
    { id: 11, mint: "6jJN1uxehgYpRuaH3U5rCd4e5rDDCVzFXyzaHpBzmSuh" },
    { id: 12, mint: "Bofhfri8WBdWDhd4XdKTfgJyyNWunCEDgkMN354jFZ56" },
    { id: 13, mint: "1mTbdsd6obUHiyk9pAbbS4C2RZ1qxkJZLuF23qk4phC" },
    { id: 14, mint: "C32Dd39i2Mpj9cuhTwiZLC6jFQKG3syYreJ8japt2DaU" },
    { id: 15, mint: "Eq7he3SDiK9edFbcBwmamsxN2dn3YmNDAv6Po2QiUAPq" },
    { id: 16, mint: "J1mAZjtcspqMwyPvYWxsqjtbEMopQB8nxs7Ya1hh9rNG" },
    { id: 17, mint: "G6wR8qXzzM8Jvy9TDQwin9feXbQaQfHUGqLYh3rWvtRc" },
    { id: 18, mint: "F9uhT8oFTbi3SaCr24CRV9pvaM7egK16VPPQhbTsWXQE" },
    { id: 19, mint: "DH58k2CH4Hg7aG6MApLKgZBE5Hd29TpohMzcnaHhYz3r" },
    { id: 20, mint: "8DUUzYDZGw26czZN7TX3NwbKmxgYYApTqG8hgMcbtGHV" },
    { id: 21, mint: "37c4FiKVnWBoYoKeECmRqpnZrrc8gdu7GVtqLvRyQdv1" },
    { id: 22, mint: "53xJzGyubXpPwyU5ChAno3FWzUFBXBVMTW9gmvtaV5Ee" },
    { id: 23, mint: "raYVFKUXMdHmcUgWFeisRRTVdUqks7kqBWfbebDN975" },
    { id: 24, mint: "9RN8YKMyFV1xx1fGYMnGeTh7hdAKZDAotRSSYXWrMbFe" },
    { id: 25, mint: "FBjfMu97MPJQ82y5wLzCXNZiw81roWtr7juoEeaxVDfG" },
    { id: 26, mint: "78RuvHJBvGwzWV26UmQUQHoedV1mw3yMyxJQL6esvNfm" },
    { id: 27, mint: "BXnrzYmTxHXAd38WdJej6pnLoiNtXsoKbhUUy23nX9N1" },
    { id: 28, mint: "DRqBiRy6BZN4Vt1XSZBceY8LKH9TEPwkLmHYik4wzAAd" },
    { id: 29, mint: "6Qcv72HR7QSWZUZH1GR6um8jzkhu9DbsyfhwQtHueK6u" },
    { id: 30, mint: "G1hBSbiAtHU7KWSbiEsy2VysiXAwayAXLG4NK4V8QsrW" },
    { id: 31, mint: "Gi4h3ZBtvA91NLQ5fNfMwCrCXpQ4aJkadeeuJKdSnLkZ" },
    { id: 32, mint: "32pnPdQm39xKLseo7vDCJtZWPv7KYdezkK9iMDtDFpzd" },
    { id: 33, mint: "E55GSPV611B9tusAzAPn5RmBrfmJvwTS1t6Kwno1rrzp" },
    { id: 34, mint: "FpvgXVyNEFUV2pR1HKQLyk1UEeZ1FhNGZqy6aa5P9WVV" },
    { id: 35, mint: "3M33SbynPZDXk1qNQtyykatv213W9FDGcBnAqYRkutpY" },
    { id: 36, mint: "3mY5uF1KafCUzVzLDLgfQ3KEPKUFj8bBhbT1m9boxXDr" },
    { id: 37, mint: "61UcBsrGyc71mZxfrJDGJeHgwdcdoZjBpicqy271JJD5" },
    { id: 38, mint: "9XxgkGmrYkjCGCybQ6BXRtftRLvq4ypPirDw4KfH81yB" },
    { id: 39, mint: "EmhPdqMmNYLQSmJtoe52SowPU7phecqbBnfW1Tpvvmx1" },
    { id: 40, mint: "gyoEoWuhe4daLq2jvBBaX8xUggdCxZYuf9DhGLjJPA3" },
    { id: 41, mint: "A7EZND31r8MJgXYB3BR4qKtXb7oMEMQ2YjYtSYLo9u4a" },
  ];
  await MintList.bulkCreate(mint_list);
};

const createUsers = async () => {
  const mint_list = [
    {
      id: 10,
      username: "talhajaami",
      email: "talhajaami@gmail.com",
      password: "$2a$10$bu8OafD0p1Izl2Frx3OnXudKVw8w3SMMi9QcEDqwgJEqa5dhJ.Zye",
      walletAddress: "21YGCvp4zDkkZEvyzkEjW7dCWiJazwsB1tRXNT7VM9Ke",
    },
    {
      id: 12,
      username: "talhajaami",
      email: "talhajaami005@gmail.com",
      password: "$2a$10$rBPw05idd1pOgE2IkjhVEel4l6lA4VBW.vXsIv1bwKtTgL2oXE4wK",
      walletAddress: "ERZzVB4KuGprBLgfLq5r6YutektMp7xZQTC952BmGhXy",
    },
    {
      id: 13,
      username: "zohaib",
      email: "zohaib@gmail.com",
      password: "$2a$10$uumYGfyv7SfFT6p9M7VNGODOwk1yyQHu8neLccSxKxkbDG5irIeUi",
      walletAddress: "A1dtvVaRo1YzijAi49ie81rrzL5SiVnANTYpJ17MD11M",
    },
  ];
  await User.bulkCreate(mint_list);
};

const createGods = async () => {
  const gods_list = [
    {
      name: "Gaem",
      symbol: "Earth",
    },
    {
      name: "Myx",
      symbol: "Darkness",
    },
    {
      name: "Lumen",
      symbol: "Light",
    },
    {
      name: "Emther",
      symbol: "Movement",
    },
  ];

  await God.bulkCreate(gods_list);
};
const seedDB = async () => {
  try {
    await createMintList();
    await createUsers();
    await createGods();
  } catch (error) {
    console.log("There is some error in seeding database", error);
  }
};

seedDB();
