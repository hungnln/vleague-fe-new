// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';
import SportsOutlinedIcon from '@mui/icons-material/SportsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);
const ICONS = {
  stadium: <EmojiTransportationIcon />,
  referee: <SportsOutlinedIcon />,
  tournament: <EmojiEventsOutlinedIcon />,
  club: <GroupsOutlinedIcon />,
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  player: getIcon('ic_user'),
  staff: getIcon('ic_user'),
  user: <ManageAccountsIcon />,
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'dashboard',
    items: [
      {
        title: 'news',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        // children: [
        //   { title: 'posts', path: PATH_DASHBOARD.blog.posts },
        //   { title: 'post', path: PATH_DASHBOARD.blog.postById },
        //   { title: 'new post', path: PATH_DASHBOARD.blog.newPost }
        // ]
      },
      // {
      //   title: 'app',
      //   path: PATH_DASHBOARD.general.app,
      //   icon: ICONS.dashboard
      // },
      // { title: 'e-commerce1', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },

      // { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      // { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking }
      // { title: 'player', path: PATH_DASHBOARD.player.root, icon: ICONS.booking }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------

  {
    subheader: 'tournament',
    items: [
      {
        title: 'tournament',
        path: PATH_DASHBOARD.tournament.root,
        icon: ICONS.tournament,
      },
      {
        title: 'referee',
        path: PATH_DASHBOARD.referee.root,
        icon: ICONS.referee,
      }

    ]
  },

  // CLUB
  // -------------------------------------------------------------------------
  {
    subheader: 'club',
    items: [
      // CLUB : PLAYER,CLUB,STAFF
      {
        title: 'club',
        path: PATH_DASHBOARD.club.root,
        icon: ICONS.club,
        // children: [
        //   { title: 'list', path: PATH_DASHBOARD.club.list },
        //   { title: 'contract', path: PATH_DASHBOARD.club.contract },
        // ]
      },
      {
        title: 'player',
        path: PATH_DASHBOARD.player.root,
        icon: ICONS.player,
        // children: [
        //   // { title: 'profile', path: PATH_DASHBOARD.player.profile },
        //   // { title: 'cards', path: PATH_DASHBOARD.player.cards },
        //   { title: 'list', path: PATH_DASHBOARD.player.list },
        //   // { title: 'create', path: PATH_DASHBOARD.player.newPlayer },
        //   { title: 'contract', path: PATH_DASHBOARD.player.contract },
        //   // { title: 'edit', path: PATH_DASHBOARD.player.editById },
        //   // { title: 'account', path: PATH_DASHBOARD.player.account }
        // ]
      },
      {
        title: 'staff',
        path: PATH_DASHBOARD.staff.root,
        icon: ICONS.staff,
        // children: [   
        //   { title: 'list', path: PATH_DASHBOARD.staff.list },        
        //   { title: 'contract', path: PATH_DASHBOARD.staff.contract },
        // ]
      },
      {
        title: 'stadium',
        path: PATH_DASHBOARD.stadium.root,
        icon: ICONS.stadium,
        // children: [
        //   // { title: 'profile', path: PATH_DASHBOARD.player.profile },
        //   // { title: 'cards', path: PATH_DASHBOARD.player.cards },
        //   { title: 'list', path: PATH_DASHBOARD.stadium.list },
        //   // { title: 'create', path: PATH_DASHBOARD.stadium.newStadium },
        //   // { title: 'edit', path: PATH_DASHBOARD.player.editById },
        //   // { title: 'account', path: PATH_DASHBOARD.player.account }
        // ]
      }
    ]
  },
  {
    subheader: 'account',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        // children: [
        //   { title: 'profile', path: PATH_DASHBOARD.user.profile },
        //   // { title: 'cards', path: PATH_DASHBOARD.user.cards },
        //   { title: 'list', path: PATH_DASHBOARD.user.list },
        //   // { title: 'create', path: PATH_DASHBOARD.user.newUser },
        //   // { title: 'edit', path: PATH_DASHBOARD.user.editById },
        //   { title: 'account', path: PATH_DASHBOARD.user.account }
        // ]
      },
      // {
      //   title: 'player',
      //   path: PATH_DASHBOARD.player.root,
      //   icon: ICONS.user,
      //   children: [
      //     { title: 'profile', path: PATH_DASHBOARD.player.profile },
      //     { title: 'cards', path: PATH_DASHBOARD.player.cards },
      //     { title: 'list', path: PATH_DASHBOARD.player.list },
      //     { title: 'create', path: PATH_DASHBOARD.player.newPlayer },
      //     { title: 'edit', path: PATH_DASHBOARD.player.editById },
      //     { title: 'account', path: PATH_DASHBOARD.player.account }
      //   ]
      // },

      // MANAGEMENT : E-COMMERCE
      // {
      //   title: 'e-commerce',
      //   path: PATH_DASHBOARD.eCommerce.root,
      //   icon: ICONS.cart,
      //   children: [
      //     { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
      //     { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
      //     { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
      //     { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
      //     { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
      //     { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
      //     { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
      //   ]
      // },

      // MANAGEMENT : BLOG

    ]
  },
  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">2</Label>
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //     {
  //       title: 'kanban',
  //       path: PATH_DASHBOARD.kanban,
  //       icon: ICONS.kanban
  //     }
  //   ]
  // }
];

export default sidebarConfig;
