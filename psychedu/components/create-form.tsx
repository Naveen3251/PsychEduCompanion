"use client"
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
  };
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const handleSearch = async () => {
    try {
      if (!query) {
        setSearchResults([]);
        return;
      }
      const encodedQuery = encodeURIComponent(query);
      const url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyC53W-9bpUSUL3cGAVBFpqBk_XwcKtXR80&part=snippet&q=${encodedQuery}&type=video&maxResults=15`;

      const response = await axios.get(url, { timeout: 10000 });

      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error searching YouTube:', error);
    }
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <div className='flex justify-center mt-[10px]'>
        <input
          type="text"
          value={query}
          placeholder='Search for the content title in open source'
          onChange={onQueryChange}
          className='rounded-[10px] w-[400px] h-[40px]'
        />
        <br></br>
      </div>
      <div className='flex justify-center mt-[10px]'>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {searchResults.map((video) => (
          <div key={video.id.videoId} className='mx-[30px] my-[30px]'>
            <h3 className='mx-[10px] my -[10px]'>{video.snippet.title}</h3>
            <p className='mx-[10px] my-[10px]'>{video.snippet.description}</p>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;