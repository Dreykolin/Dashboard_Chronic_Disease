import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HappinessData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/happiness')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">World Happiness Scores</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.country}: {item.score}</li>
        ))}
      </ul>
    </div>
  );
}
