import { useQuery } from '@apollo/client';
import { ALL_GENRES } from '../queries';
import { Button, Spinner, ButtonGroup } from 'react-bootstrap';

const GenreButtons = ({ selectedGenre, setSelectedGenre }) => {
  const genresQuery = useQuery(ALL_GENRES);

  if (genresQuery.loading) {
    return <Spinner animation="border" />;
  }

  if (genresQuery.error) {
    return <div>Error fetching genres!</div>;
  }

  const genres = genresQuery.data?.allGenres || [];

  return (
    <div>
      Filter by genre...&nbsp;
      <ButtonGroup>
        {genres.map((genre) => {
          const thisVariant =
            selectedGenre && selectedGenre === genre
              ? `primary`
              : `outline-primary`;
          const thisKey = `genrebutton-${genre}`;
          return (
            <Button
              size="sm"
              variant={thisVariant}
              key={thisKey}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
};

export default GenreButtons;
