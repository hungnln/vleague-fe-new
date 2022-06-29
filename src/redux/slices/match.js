import _, { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  isOpenModal: false,
  posts: [],
  matches: [],
  matchList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
  currentMatch: {},
  matchParticipation: {},
  lineup: {
    // HomeLineUp: {
    //   GoalKeeper: {
    //     id: 6,
    //     playerID: 30,
    //     player: {
    //       id: 30,
    //       name: 'Dương Văn Lợi',
    //       imageURL: 'https://noobercong.blob.core.windows.net/dms/37fb8771-c27a-4672-ae17-80ef400fd60b',
    //       dateOfBirth: '2004-12-01T17:00:00'
    //     },
    //     clubID: 10,
    //     club: null,
    //     number: 1,
    //     salary: 20000000,
    //     start: '2022-06-21T16:05:01.061',
    //     end: '2023-06-21T16:05:07.589',
    //     description: 'demo'
    //   },
    //   Defender: [
    //     {
    //       id: 7,
    //       playerID: 31,
    //       player: {
    //         id: 31,
    //         name: 'Lê Văn Sơn',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/f641d379-a09c-4631-9abf-7fdc894ca2e1',
    //         dateOfBirth: '1996-12-19T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 2,
    //       salary: 20000000,
    //       start: '2022-06-21T16:06:06.2',
    //       end: '2023-06-21T16:06:21.857',
    //       description: 'demo'
    //     },
    //     {
    //       id: 9,
    //       playerID: 34,
    //       player: {
    //         id: 34,
    //         name: 'Lương Xuân Trường',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/7f1456ad-e664-4e22-a1cc-ee7e1f9dad79',
    //         dateOfBirth: '1995-04-27T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 6,
    //       salary: 20000000,
    //       start: '2022-06-21T16:07:48.474',
    //       end: '2023-06-21T16:07:50.182',
    //       description: '1'
    //     }
    //   ],
    //   Midfielder: [
    //     {
    //       id: 8,
    //       playerID: 32,
    //       player: {
    //         id: 32,
    //         name: 'Kim Dongsu',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/a5cef09f-fa2b-4987-9109-50bee49fe854',
    //         dateOfBirth: '1995-03-20T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 3,
    //       salary: 20000000,
    //       start: '2022-06-21T16:06:56.377',
    //       end: '2023-06-21T16:06:58.196',
    //       description: 'demo'
    //     },
    //     {
    //       id: 10,
    //       playerID: 35,
    //       player: {
    //         id: 35,
    //         name: 'Nguyễn Phong Hồng Duy',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/e7553af6-48c3-484f-ac40-ebf41f0a9cbc',
    //         dateOfBirth: '1996-06-12T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 7,
    //       salary: 20000000,
    //       start: '2022-06-21T16:08:17.264',
    //       end: '2023-06-21T16:08:19.198',
    //       description: '1'
    //     },
    //     {
    //       id: 11,
    //       playerID: 36,
    //       player: {
    //         id: 36,
    //         name: 'Trần Minh Vương',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/f11cdd3d-a2ed-4c79-a306-65e3916c55f3',
    //         dateOfBirth: '1995-03-27T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 8,
    //       salary: 20000000,
    //       start: '2022-06-21T16:08:48.178',
    //       end: '2023-06-21T16:08:49.769',
    //       description: '1'
    //     },
    //     {
    //       id: 13,
    //       playerID: 38,
    //       player: {
    //         id: 38,
    //         name: 'Nguyễn Công Phượng',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/1166548c-8780-4cbb-b4c8-08b8f1e54fa0',
    //         dateOfBirth: '1995-01-20T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 10,
    //       salary: 20000000,
    //       start: '2022-06-21T16:09:58.559',
    //       end: '2023-06-21T16:10:00.042',
    //       description: '1'
    //     },
    //     {
    //       id: 14,
    //       playerID: 39,
    //       player: {
    //         id: 39,
    //         name: 'Nguyễn Tuấn Anh',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/5152c262-a952-4014-aea4-8874280362bf',
    //         dateOfBirth: '1995-05-15T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 11,
    //       salary: 20000000,
    //       start: '2022-06-21T16:10:23.702',
    //       end: '2023-06-21T16:10:25.763',
    //       description: '1'
    //     }
    //   ],
    //   Forward: [
    //     {
    //       id: 15,
    //       playerID: 40,
    //       player: {
    //         id: 40,
    //         name: 'Tiêu Ê Xal',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/1eb50819-c019-48b9-8ec5-c6e7d392087b',
    //         dateOfBirth: '2000-08-13T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 12,
    //       salary: 200000000,
    //       start: '2022-06-21T16:10:54.94',
    //       end: '2023-06-21T16:10:56.277',
    //       description: '1'
    //     },
    //     {
    //       id: 16,
    //       playerID: 41,
    //       player: {
    //         id: 41,
    //         name: 'Nguyễn Hữu Tuấn',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/cafd2ba4-febb-4334-9cfd-88ecfba40a52',
    //         dateOfBirth: '1992-05-05T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 15,
    //       salary: 20000000,
    //       start: '2022-06-21T16:11:20.581',
    //       end: '2023-06-21T16:11:22.087',
    //       description: '1'
    //     },
    //     {
    //       id: 17,
    //       playerID: 42,
    //       player: {
    //         id: 42,
    //         name: 'Vũ Văn Thanh',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/77609db3-6d57-48e9-8fc0-abef1a43a58c',
    //         dateOfBirth: '1996-04-13T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 17,
    //       salary: 20000000,
    //       start: '2022-06-21T16:12:02.656',
    //       end: '2023-06-21T16:12:17.748',
    //       description: '1'
    //     }
    //   ]
    // },
    // HomeReverse: {
    //   GoalKeeper: {
    //     id: 18,
    //     playerID: 43,
    //     player: {
    //       id: 43,
    //       name: 'Trần Bảo Toàn',
    //       heightCm: null,
    //       weightKg: null,
    //       imageURL: 'https://noobercong.blob.core.windows.net/dms/e3e9527e-0a9e-4820-b636-c802df3b5577',
    //       dateOfBirth: '2000-07-13T17:00:00'
    //     },
    //     clubID: 10,
    //     club: null,
    //     number: 20,
    //     salary: 20000000,
    //     start: '2022-06-21T16:12:46.106',
    //     end: '2023-06-21T16:12:48.129',
    //     description: '1'
    //   },
    //   Defender: [
    //     {
    //       id: 19,
    //       playerID: 44,
    //       player: {
    //         id: 44,
    //         name: 'Lê Huy Kiệt',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/f39e6091-1464-4438-8a89-9a13844c0462',
    //         dateOfBirth: '2003-10-19T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 21,
    //       salary: 20000000,
    //       start: '2022-06-21T16:14:37.686',
    //       end: '2023-06-21T16:14:39.422',
    //       description: '1'
    //     }
    //   ],
    //   Midfielder: [
    //     {
    //       id: 20,
    //       playerID: 45,
    //       player: {
    //         id: 45,
    //         name: 'Nguyễn Nhĩ Khang',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/f1fffa6f-7099-425c-a5a1-df4f6f26d975',
    //         dateOfBirth: '2001-02-15T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 22,
    //       salary: 20000000,
    //       start: '2022-06-21T16:16:11.989',
    //       end: '2023-06-21T16:16:13.488',
    //       description: '1'
    //     },
    //     {
    //       id: 22,
    //       playerID: 47,
    //       player: {
    //         id: 47,
    //         name: 'Nguyễn Đức Việt',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/18991833-646a-4b4b-a559-7dcdcc3cc574',
    //         dateOfBirth: '2003-12-31T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 24,
    //       salary: 20000000,
    //       start: '2022-06-21T16:16:57.533',
    //       end: '2023-06-21T16:16:58.919',
    //       description: '1'
    //     },
    //     {
    //       id: 23,
    //       playerID: 48,
    //       player: {
    //         id: 48,
    //         name: 'Huỳnh Tuấn Linh',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/f75f950d-59af-49d9-a915-811aaf12e521',
    //         dateOfBirth: '1991-04-11T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 26,
    //       salary: 20000000,
    //       start: '2022-06-21T16:17:26.493',
    //       end: '2023-06-21T16:17:37.72',
    //       description: '1'
    //     },
    //     {
    //       id: 24,
    //       playerID: 49,
    //       player: {
    //         id: 49,
    //         name: 'Nguyễn Văn Triệu',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/d3298d2b-22a2-4f51-9d1e-c1ffbc9c6de7',
    //         dateOfBirth: '2003-01-16T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 27,
    //       salary: 20000000,
    //       start: '2022-06-21T16:18:02.445',
    //       end: '2023-06-21T16:18:03.89',
    //       description: '1'
    //     },
    //     {
    //       id: 25,
    //       playerID: 50,
    //       player: {
    //         id: 50,
    //         name: 'Nguyễn Văn Việt',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/161df716-c734-4ad6-b664-591e3f188b3e',
    //         dateOfBirth: '1989-01-16T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 28,
    //       salary: 20000000,
    //       start: '2022-06-21T16:18:46.359',
    //       end: '2023-06-21T16:18:47.828',
    //       description: '1'
    //     },
    //     {
    //       id: 26,
    //       playerID: 51,
    //       player: {
    //         id: 51,
    //         name: 'Washington Brandão Dos Santos',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/c95d268d-a09c-4259-be61-45cc91c9c273',
    //         dateOfBirth: '1990-08-17T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 30,
    //       salary: 20000000,
    //       start: '2022-06-21T16:19:04.844',
    //       end: '2023-06-21T16:19:06.208',
    //       description: '1'
    //     },
    //     {
    //       id: 27,
    //       playerID: 52,
    //       player: {
    //         id: 52,
    //         name: 'Lê Hữu Phước',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/401ad076-1828-4618-b6a7-c71df3dfe0d4',
    //         dateOfBirth: '2001-05-06T17:00:00'
    //       },
    //       clubID: 10,
    //       club: null,
    //       number: 34,
    //       salary: 20000000,
    //       start: '2022-06-21T16:19:26.539',
    //       end: '2023-06-21T16:19:27.879',
    //       description: '1'
    //     }
    //   ],
    //   Forward: []
    // },
    // AwayLineUp: {
    //   GoalKeeper: {
    //     id: 36,
    //     playerID: 96,
    //     player: {
    //       id: 96,
    //       name: 'Đinh Viết Tú',
    //       heightCm: null,
    //       weightKg: null,
    //       imageURL: 'https://noobercong.blob.core.windows.net/dms/f91324e7-9c5c-4e6a-a453-bab7e596c99d',
    //       dateOfBirth: '1992-08-15T17:00:00'
    //     },
    //     clubID: 11,
    //     club: null,
    //     number: 2,
    //     salary: 20000000,
    //     start: '2022-06-27T05:53:26.991',
    //     end: '2023-06-27T05:53:29.287',
    //     description: 'Demo'
    //   },
    //   Defender: [
    //     {
    //       id: 37,
    //       playerID: 97,
    //       player: {
    //         id: 97,
    //         name: 'Phạm Mạnh Hùng',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/12ba5ad0-993b-4ce5-9733-8dddd6023ffa',
    //         dateOfBirth: '1993-03-02T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 3,
    //       salary: 20000000,
    //       start: '2021-06-27T15:18:34.056',
    //       end: '2023-06-27T15:18:35.891',
    //       description: 'demo'
    //     }
    //   ],
    //   Midfielder: [
    //     {
    //       id: 38,
    //       playerID: 98,
    //       player: {
    //         id: 98,
    //         name: 'Trần Đăng Đức Anh',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/c9080cf4-a5a6-4554-a31c-8f9507a10d43',
    //         dateOfBirth: '2001-06-14T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 5,
    //       salary: 20000000,
    //       start: '2021-06-27T15:19:18.199',
    //       end: '2023-06-27T15:19:20.157',
    //       description: 'demo'
    //     },
    //     {
    //       id: 39,
    //       playerID: 99,
    //       player: {
    //         id: 99,
    //         name: 'Phạm Minh Nghĩa',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/9639eae5-1bfa-48a6-b3fa-bd85416cc729',
    //         dateOfBirth: '1998-09-24T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 7,
    //       salary: 20000000,
    //       start: '2021-06-27T15:19:46.785',
    //       end: '2023-06-27T15:19:53.534',
    //       description: 'demo'
    //     },
    //     {
    //       id: 40,
    //       playerID: 100,
    //       player: {
    //         id: 100,
    //         name: 'Nguyễn Đình Sơn',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/0f58ac5d-5f89-4f56-8009-6e86311347d5',
    //         dateOfBirth: '2001-05-04T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 8,
    //       salary: 20000000,
    //       start: '2021-06-27T15:20:26.399',
    //       end: '2023-06-27T15:20:28.328',
    //       description: 'demo'
    //     },
    //     {
    //       id: 41,
    //       playerID: 101,
    //       player: {
    //         id: 101,
    //         name: 'Hoàng Xuân Tân',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/7a53a06e-04fb-40ad-8561-1a6d3998d325',
    //         dateOfBirth: '2001-02-21T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 9,
    //       salary: 20000000,
    //       start: '2021-06-27T15:20:53.205',
    //       end: '2023-06-27T15:20:55.064',
    //       description: 'demo'
    //     },
    //     {
    //       id: 42,
    //       playerID: 102,
    //       player: {
    //         id: 102,
    //         name: 'Trần Mạnh Hùng',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/a277123c-9e01-420a-878f-aa6cebc3cc8e',
    //         dateOfBirth: '1997-03-16T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 10,
    //       salary: 20000000,
    //       start: '2021-06-27T15:22:03.26',
    //       end: '2023-06-27T15:22:05.24',
    //       description: 'demo'
    //     }
    //   ],
    //   Forward: [
    //     {
    //       id: 46,
    //       playerID: 106,
    //       player: {
    //         id: 106,
    //         name: 'Nguyễn Đình Mạnh',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/38b8c45f-bacf-4671-9426-685b33dc2843',
    //         dateOfBirth: '1998-04-24T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 16,
    //       salary: 20000000,
    //       start: '2022-06-27T15:23:46.748',
    //       end: '2023-06-27T15:23:48.368',
    //       description: 'demo'
    //     },
    //     {
    //       id: 45,
    //       playerID: 105,
    //       player: {
    //         id: 105,
    //         name: 'Marcio de Oliveira Marques',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/8b2e0147-cd63-421f-bf5b-614b518a5c2b',
    //         dateOfBirth: '1995-04-13T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 14,
    //       salary: 20000000,
    //       start: '2021-06-27T15:23:22.369',
    //       end: '2023-06-27T15:23:24.391',
    //       description: 'demo'
    //     },
    //     {
    //       id: 44,
    //       playerID: 104,
    //       player: {
    //         id: 104,
    //         name: 'Đinh Văn Trường',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/f4d44d84-80d7-472c-bddb-e2bbd9fb1761',
    //         dateOfBirth: '1996-10-21T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 12,
    //       salary: 20000000,
    //       start: '2021-06-27T15:22:57.056',
    //       end: '2023-06-27T15:22:59.287',
    //       description: 'demo'
    //     },
    //     {
    //       id: 47,
    //       playerID: 107,
    //       player: {
    //         id: 107,
    //         name: 'Phan Thế Hưng',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/fdefeb24-d6fd-4bfc-93cc-5c278fbcebd3',
    //         dateOfBirth: '2002-10-20T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 17,
    //       salary: 20000000,
    //       start: '2021-06-27T15:24:44.217',
    //       end: '2023-06-27T15:24:46.053',
    //       description: 'demo'
    //     }
    //   ]
    // },
    // AwayReverse: {
    //   GoalKeeper: {
    //     id: 43,
    //     playerID: 103,
    //     player: {
    //       id: 103,
    //       name: 'Rodrigo Da Silva Dias',
    //       heightCm: null,
    //       weightKg: null,
    //       imageURL: 'https://noobercong.blob.core.windows.net/dms/5b673dd4-970e-482e-8f53-c6fcff2df97a',
    //       dateOfBirth: '1994-01-25T17:00:00'
    //     },
    //     clubID: 11,
    //     club: null,
    //     number: 11,
    //     salary: 20000000,
    //     start: '2021-06-27T15:22:25.215',
    //     end: '2023-06-27T15:22:27.495',
    //     description: 'demo'
    //   },
    //   Defender: [
    //     {
    //       id: 48,
    //       playerID: 108,
    //       player: {
    //         id: 108,
    //         name: 'Đoàn Thanh Trường',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/2c8f2405-0579-43cc-8887-dca413348a24',
    //         dateOfBirth: '2000-11-02T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 18,
    //       salary: 20000000,
    //       start: '2021-06-27T15:25:07.578',
    //       end: '2023-06-27T15:25:09.18',
    //       description: 'demo'
    //     }
    //   ],
    //   Midfielder: [
    //     {
    //       id: 50,
    //       playerID: 110,
    //       player: {
    //         id: 110,
    //         name: 'Hồ Văn Tú',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/7f4f8960-e118-4222-bbcc-b418091ba817',
    //         dateOfBirth: '1995-04-21T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 22,
    //       salary: 20000000,
    //       start: '2021-06-27T15:25:50.41',
    //       end: '2023-06-27T15:25:52.614',
    //       description: 'demo'
    //     }
    //   ],
    //   Forward: [
    //     {
    //       id: 52,
    //       playerID: 112,
    //       player: {
    //         id: 112,
    //         name: 'Đoàn Văn Nam',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/fae1d591-7a23-4f6d-a1cb-87aaf4c2c002',
    //         dateOfBirth: '2002-03-07T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 25,
    //       salary: 20000000,
    //       start: '2021-06-27T15:27:45.337',
    //       end: '2023-06-27T15:27:46.956',
    //       description: 'demo'
    //     },
    //     {
    //       id: 56,
    //       playerID: 115,
    //       player: {
    //         id: 115,
    //         name: 'Phạm Văn Soạn',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/bd801f05-4963-4800-ba8e-a9dcc4690181',
    //         dateOfBirth: '2002-03-17T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 34,
    //       salary: 20000000,
    //       start: '2021-06-27T15:29:58.732',
    //       end: '2023-06-27T15:30:00.185',
    //       description: 'demo'
    //     },
    //     {
    //       id: 55,
    //       playerID: 114,
    //       player: {
    //         id: 114,
    //         name: 'Vũ Thế Vương',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/85c02597-a246-429c-8df7-f0ab179891a3',
    //         dateOfBirth: '1994-01-02T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 30,
    //       salary: 20000000,
    //       start: '2021-06-27T15:29:31.331',
    //       end: '2023-06-27T15:29:32.987',
    //       description: 'demo'
    //     },
    //     {
    //       id: 62,
    //       playerID: 121,
    //       player: {
    //         id: 121,
    //         name: 'Vũ Hoàng Trà',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/ab4b5fb7-06b6-4538-90c3-452dcfa42f31',
    //         dateOfBirth: '2002-03-05T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 68,
    //       salary: 20000000,
    //       start: '2021-06-27T15:33:39.185',
    //       end: '2023-06-27T15:33:44.922',
    //       description: 'demo'
    //     },
    //     {
    //       id: 60,
    //       playerID: 119,
    //       player: {
    //         id: 119,
    //         name: 'Đinh Xuân Việt',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/b0879e97-7a12-4f03-b858-073f90d876d1',
    //         dateOfBirth: '1983-11-09T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 56,
    //       salary: 20000000,
    //       start: '2022-06-27T15:32:07',
    //       end: '2023-06-27T15:32:08.471',
    //       description: 'demo'
    //     },
    //     {
    //       id: 59,
    //       playerID: 118,
    //       player: {
    //         id: 118,
    //         name: 'Trần Trung Hiếu',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/d07f5d2e-d381-48b9-8826-97d49e7b2fd4',
    //         dateOfBirth: '1993-02-01T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 39,
    //       salary: 20000000,
    //       start: '2021-06-27T15:31:50.77',
    //       end: '2023-06-27T15:31:52.193',
    //       description: 'demo'
    //     },
    //     {
    //       id: 64,
    //       playerID: 123,
    //       player: {
    //         id: 123,
    //         name: 'Vũ Quang Độ',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/35ec971b-e379-408c-9549-efa27dbea30a',
    //         dateOfBirth: '2000-05-21T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 78,
    //       salary: 20000000,
    //       start: '2021-06-27T15:34:20.863',
    //       end: '2023-06-27T15:34:22.649',
    //       description: 'demo'
    //     },
    //     {
    //       id: 66,
    //       playerID: 125,
    //       player: {
    //         id: 125,
    //         name: 'Đồng Văn Trung',
    //         heightCm: null,
    //         weightKg: null,
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/6e28d0b8-d57f-4ad8-9466-759679e1f1c5',
    //         dateOfBirth: '1994-02-28T17:00:00'
    //       },
    //       clubID: 11,
    //       club: null,
    //       number: 94,
    //       salary: 20000000,
    //       start: '2021-06-27T15:34:53.341',
    //       end: '2023-06-27T15:34:58.099',
    //       description: 'demo'
    //     }
    //   ]
    // },
    // HomeStaff: {
    //   HeadCoach: {
    //     id: 16,
    //     staffID: 8,
    //     staff: {
    //       id: 8,
    //       name: 'Kiatisuk Senamuang',
    //       imageURL: 'https://noobercong.blob.core.windows.net/dms/ec2fdd2f-716a-4204-80ec-2119e4280092'
    //     },
    //     clubID: 10,
    //     club: null,
    //     salary: 1000000000,
    //     start: '2022-06-21T16:24:48.662',
    //     end: '2023-06-21T16:24:50.166',
    //     description: '1'
    //   },
    //   AssistantCoach: [
    //     {
    //       id: 17,
    //       staffID: 13,
    //       staff: {
    //         id: 13,
    //         name: 'Kiatisuk Senamuang 1',
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/1bcf41c4-0d53-4e2c-8cae-9e2f446d0d08'
    //       },
    //       clubID: 10,
    //       club: null,
    //       salary: 20000000,
    //       start: '2021-06-27T15:40:58.088',
    //       end: '2023-06-27T15:40:59.602',
    //       description: 'demo'
    //     }
    //   ],
    //   MedicalTeam: [
    //     {
    //       id: 18,
    //       staffID: 14,
    //       staff: {
    //         id: 14,
    //         name: 'Kiatisuk Senamuang 2',
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/32e6c9ea-be17-4adb-81fd-3e3ae2e13aef'
    //       },
    //       clubID: 10,
    //       club: null,
    //       salary: 20000000,
    //       start: '2021-06-27T15:41:24.412',
    //       end: '2023-06-27T15:41:28.77',
    //       description: 'demo'
    //     }
    //   ]
    // },
    // AwayStaff: {
    //   HeadCoach: {
    //     id: 20,
    //     staffID: 9,
    //     staff: {
    //       id: 9,
    //       name: 'Nguyễn Văn Sỹ',
    //       imageURL: 'https://noobercong.blob.core.windows.net/dms/5ce79a59-333f-4d77-8b74-e8c038414174'
    //     },
    //     clubID: 11,
    //     club: null,
    //     salary: 20000000,
    //     start: '2021-06-27T15:42:25.036',
    //     end: '2023-06-27T15:42:26.32',
    //     description: 'demo'
    //   },
    //   AssistantCoach: [
    //     {
    //       id: 22,
    //       staffID: 11,
    //       staff: {
    //         id: 11,
    //         name: 'Nguyễn Văn Sỹ 2',
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/8968f97f-eb24-4bab-a9f4-9ee4422c61b5'
    //       },
    //       clubID: 11,
    //       club: null,
    //       salary: 20000000,
    //       start: '2021-06-27T15:42:54.447',
    //       end: '2023-06-27T15:42:56.107',
    //       description: 'demo'
    //     }
    //   ],
    //   MedicalTeam: [
    //     {
    //       id: 23,
    //       staffID: 12,
    //       staff: {
    //         id: 12,
    //         name: 'Nguyễn Văn Sỹ 3',
    //         imageURL: 'https://noobercong.blob.core.windows.net/dms/288d848f-6f98-424a-abb9-4986c1db61f0'
    //       },
    //       clubID: 11,
    //       club: null,
    //       salary: 20000000,
    //       start: '2021-06-27T15:43:08.831',
    //       end: '2023-06-27T15:43:10.551',
    //       description: 'demo'
    //     }
    //   ]
    // }
  },
  playerMatch: {
    HomeClub: [],
    AwayClub: []
  },
  staffMatch: [],
  RefereeMatch: [],

};

const slice = createSlice({
  name: 'match',
  initialState,
  extraReducers: {

  },
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET USERS
    getMatchesSuccess(state, action) {
      state.isLoading = false;
      state.matches = action.payload;
    },

    // DELETE USERS
    deleteMatch(state, action) {
      const deleteMatch = filter(state.matchList, (match) => match.id !== action.payload);
      state.matchList = deleteMatch;
    },

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },

    // GET FRIENDS
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.friends = action.payload;
    },

    // GET GALLERY
    getGallerySuccess(state, action) {
      state.isLoading = false;
      state.gallery = action.payload;
    },

    // GET MANAGE USERS
    getMatchListSuccess(state, action) {
      state.isLoading = false;
      state.matchList = action.payload;
    },

    // GET CARDS
    getPlayerMatchSuccess(state, homeAction, awayAction) {
      state.isLoading = false;
      state.playerMatch.HomeClub = homeAction;
      state.playerMatch.AwayClub = awayAction;
    },

    // GET ADDRESS BOOK
    getAddressBookSuccess(state, action) {
      state.isLoading = false;
      state.addressBook = action.payload;
    },

    // GET INVOICES
    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    }
    ,
    addMatch(state, action) {
      state.isLoading = false;
      const newMatchList = [...state.matchList, action.payload]
      state.matchList = newMatchList
    },
    editMatch(state, action) {
      state.isLoading = false;
      const newMatchList = state.matchList.map(match => {
        if (Number(match.id) === Number(action.payload.id)) {
          return action.payload
        }
        return match
      })
      state.matchList = newMatchList
    },
    getMatchDetail(state, action) {
      state.isLoading = false;
      state.currentMatch = action.payload
    },
    getMatchParticipationSuccess(state, action) {
      state.isLoading = false;
      state.matchParticipation = action.payload
    },
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
    },
    addLineUp(state, action) {
      state.isLoading = false;
      state.matchParticipation = { ...state.matchParticipation, ...action.payload }
    }
  },

});

// Reducer
export default slice.reducer;
// Actions
export const { onToggleFollow, deleteMatch, openModal, closeModal } = slice.actions;
export function getMatchList(tournamentId, roundId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/matches?TournamentID=${tournamentId}&RoundID=${roundId}`);
      dispatch(slice.actions.getMatchListSuccess(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/matches', data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.addMatch(response.data.result));
        console.log('response contract', response);
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const editMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/matches/${data.id}`, data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.editMatch(response.data.result));
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const getMatchDetail = (matchId) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/matches/${matchId}?include=homeClub, awayClub`);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.getMatchDetail(response.data.result));
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getAllPlayerMatchContract = (HomeClubID, AwayClubID) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const responseHome = await axios.get(`/api/player`);
      const responseAway = await axios.get(`/api/player-contracts?ClubID=${AwayClubID}?Include=player`);
      if (responseHome.data.statusCode === 200 && responseAway.data.statusCode === 200) {
        dispatch(slice.actions.getPlayerMatchSuccess(responseHome.data.result, responseAway.data.result));
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getMatchParticipation = (matchId, homeClubID, awayClubID, playerList, staffList, refereeList) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const DEFENDER = "Defender"
      const GOALKEEPER = "GoalKeeper"
      const MIDFIELDER = "Midfielder"
      const FORWARD = "Forward"
      const HEADCOACH = "HeadCoach"
      const ASSISTANTCOACH = "AssistantCoach"
      const MEDICALTEAM = "MedicalTeam"
      const HEADREFEREE = "HeadReferee"
      const ASSISTANTREFEREE = "AssistantReferee"
      const MONITORINGREFEREE = "MonitoringReferee"
      const response = await axios.get(`/api/matches/${matchId}/participation`);
      const { players, staffs, referees } = response.data.result
      const convertGoalKeeper = (clubID, inLineups) => {
        return players.filter((contract) => contract.role === GOALKEEPER && contract.inLineups === inLineups && contract.playerContract.clubID === clubID).reduce((obj, item) => { return { ...item.playerContract, player: playerList.find(player => player.id === item.playerContract.playerID) } }, {})
      }
      const convertPlayerRoleArr = (clubID, role, inLineups) => {
        return players.filter((contract) => contract.role === role && contract.inLineups === inLineups && contract.playerContract.clubID === clubID).reduce((obj, item) => { return [...obj, { ...item.playerContract, player: playerList.find(player => player.id === item.playerContract.playerID) }] }, [])
      }
      const convertHeadCoach = (clubID) => {
        return staffs.filter((contract) => contract.role === HEADCOACH && contract.staffContract.clubID === clubID).reduce((obj, item) => { return { ...item.staffContract, staff: staffList.find(staff => staff.id === item.staffContract.staffID) } }, {})
      }
      const convertStaffRoleArr = (clubID, role) => {
        return staffs.filter((contract) => contract.role === role && contract.staffContract.clubID === clubID).reduce((obj, item) => { return [...obj, { ...item.staffContract, staff: staffList.find(staff => staff.id === item.staffContract.staffID) }] }, [])
      }
      const convertHeadReferee = () => {
        return referees.filter((contract) => contract.role === HEADREFEREE).reduce((obj, item) => { return { ...item.referee, referee: refereeList.find(referee => referee.id === item.refereeID) } }, {})
      }
      const convertRefereeRoleArr = (role) => {
        return referees.filter((contract) => contract.role === role).reduce((obj, item) => { return [...obj, { ...item.referee, referee: refereeList.find(referee => referee.id === item.refereeID) }] }, [])
      }
      if (!_.isEmpty(players) && !_.isEmpty(staffs) && !_.isEmpty(referees)) {
        const lineup = {
          HomeLineUp: {
            GoalKeeper: convertGoalKeeper(homeClubID, true),
            Defender: convertPlayerRoleArr(homeClubID, DEFENDER, true),
            Midfielder: convertPlayerRoleArr(homeClubID, MIDFIELDER, true),
            Forward: convertPlayerRoleArr(homeClubID, FORWARD, true),
          },
          HomeReverse: {
            GoalKeeper: convertGoalKeeper(homeClubID, false),
            Defender: convertPlayerRoleArr(homeClubID, DEFENDER, false),
            Midfielder: convertPlayerRoleArr(homeClubID, MIDFIELDER, false),
            Forward: convertPlayerRoleArr(homeClubID, FORWARD, false),
          },
          AwayLineUp: {
            GoalKeeper: convertGoalKeeper(awayClubID, false),
            Defender: convertPlayerRoleArr(awayClubID, DEFENDER, false),
            Midfielder: convertPlayerRoleArr(awayClubID, MIDFIELDER, false),
            Forward: convertPlayerRoleArr(awayClubID, FORWARD, false),
          },
          AwayReverse: {
            GoalKeeper: convertGoalKeeper(awayClubID, false),
            Defender: convertPlayerRoleArr(awayClubID, DEFENDER, false),
            Midfielder: convertPlayerRoleArr(awayClubID, MIDFIELDER, false),
            Forward: convertPlayerRoleArr(awayClubID, FORWARD, false),
          },
          HomeStaff: {
            HeadCoach: convertHeadCoach(homeClubID),
            AssistantCoach: convertStaffRoleArr(homeClubID, ASSISTANTCOACH),
            MedicalTeam: convertStaffRoleArr(homeClubID, MEDICALTEAM),
          },
          AwayStaff: {
            HeadCoach: convertHeadCoach(homeClubID),
            AssistantCoach: convertStaffRoleArr(homeClubID, ASSISTANTCOACH),
            MedicalTeam: convertStaffRoleArr(homeClubID, MEDICALTEAM),
          },
          Referee: {
            HeadReferee: convertHeadReferee(),
            AssistantReferee: convertRefereeRoleArr(ASSISTANTREFEREE),
            MonitoringReferee: convertRefereeRoleArr(MONITORINGREFEREE),
          }

        }
        dispatch(slice.actions.getMatchParticipationSuccess(lineup));

      } else {
        dispatch(slice.actions.getMatchParticipationSuccess(response.data.result));
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeMatch = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/matches/${id}`);
      dispatch(slice.actions.deleteMatch(id))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export function addLineUp(object) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.addLineUp(object));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function addLineUpServer(values, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/matches/${values.id}`, values);
      if (response.data.statusCode === 200) {
        const { id, homeClubID, awayClubID } = response.data.result
        const responsePlayer = await axios.get(`api/players`)
        const responseStaff = await axios.get(`api/staffs`)
        const responseReferee = await axios.get(`api/referees`)

        dispatch(getMatchParticipation(id, homeClubID, awayClubID, responsePlayer.data.result, responseStaff.data.result, responseReferee.data.result,))
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  };
}
