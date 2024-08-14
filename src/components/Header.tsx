import { AppBar, IconButton, Link, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
type HeaderProps = {
    userID: string | number | undefined
    name: string
}
const Header = (props: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <AppBar position="static">
        <Toolbar variant="dense">
          <div className='relative'>
        <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  style={{color: "black"}}
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MenuIcon />
                </IconButton>
                {isMenuOpen && props.userID && (<div className='fixed bg-white  shadow-lg p-4 grid gap-3'>
                <Link className="text-black" href={`/`}>プロフィール</Link>
                  <Link className="text-black" href={`/edit/${props.userID}`}>編集</Link>
                  <Link className="text-black" href={`/add-friend/${props.userID}`}>フレンド追加</Link>
                  <Link className="text-black" href={`/view-friends/${props.userID}`}>フレンド一覧</Link>
                </div>)}
                </div>
          <Typography sx={{width: '100%'}} align='center' variant="h6" color="black" component="div">
            {props.name}
          </Typography>
          </Toolbar>
      </AppBar>
    )
}
export default Header