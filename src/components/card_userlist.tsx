import React from 'react';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// スタイリングを行うための styled コンポーネント
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 140,
}));

const MainContainer = styled('div')(({ theme }) => ({
  padding: 20,
}));

interface CardComponentProps {
  title: string;
 description: string;
  image: string;
  onClick: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({ title, description, image, onClick }) => {
  return (
    <MainContainer>
      <StyledCard sx={{borderRadius: 14}} style={{}}>
        <CardActionArea onClick={onClick}>
          <StyledCardMedia
            image={image}
            title={title}
          />
               
          <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{ marginRight: 5 }}>
              {description}
            </Typography>
            </div>
            </CardContent>
          
          
        </CardActionArea>
        <CardActions  sx={{ display: 'flex', justifyContent: 'center' }}> {/* 中央揃え */}
        
          <Button size="small" color="primary" onClick={onClick}>
            View Details
          
          </Button>
        </CardActions>
      </StyledCard>
    </MainContainer>
    );
};
//1