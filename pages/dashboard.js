import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/scrapedData.json');
      setData(result.data);
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const lighthouseData = {
    labels: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
    datasets: [
      {
        label: 'Lighthouse Scores',
        data: [
          data.lighthouseReport.performance,
          data.lighthouseReport.accessibility,
          data.lighthouseReport.bestPractices,
          data.lighthouseReport.seo,
        ],
        backgroundColor: [
          'rgba(75,192,192,0.2)',
          'rgba(75,192,192,0.2)',
          'rgba(75,192,192,0.2)',
          'rgba(75,192,192,0.2)',
        ],
        borderColor: [
          'rgba(75,192,192,1)',
          'rgba(75,192,192,1)',
          'rgba(75,192,192,1)',
          'rgba(75,192,192,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const elementCountsData = {
    labels: ['Links', 'Buttons', 'Paragraphs', 'Images'],
    datasets: [
      {
        label: 'Element Counts',
        data: [
          data.elementCounts.links,
          data.elementCounts.buttons,
          data.elementCounts.paragraphs,
          data.elementCounts.images,
        ],
        backgroundColor: [
          'rgba(255,99,132,0.2)',
          'rgba(54,162,235,0.2)',
          'rgba(255,206,86,0.2)',
          'rgba(75,192,192,0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
          'rgba(75,192,192,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const totalData = [
    { label: 'Total Links', count: data.elementCounts.links, class: 'excellent' },
    { label: 'Total Buttons', count: data.elementCounts.buttons, class: 'good' },
    { label: 'Total Paragraphs', count: data.elementCounts.paragraphs, class: 'average' },
    { label: 'Total Images', count: data.elementCounts.images, class: 'good' },
    { label: 'Performance Score', count: data.lighthouseReport.performance, class: 'excellent' },
    { label: 'Accessibility Score', count: data.lighthouseReport.accessibility, class: 'good' },
    { label: 'Best Practices Score', count: data.lighthouseReport.bestPractices, class: 'average' },
    { label: 'SEO Score', count: data.lighthouseReport.seo, class: 'poor' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{data.pageTitle}</h1>

      <div className="total-container">
        {totalData.map((item, index) => (
          <div key={index} className={`total-card ${item.class}`}>
            <h2>{item.label}</h2>
            <p>{item.count}</p>
          </div>
        ))}
      </div>

      <div className="grid-container">
        <div className="card">
          <h2>Element Counts</h2>
          <Doughnut data={elementCountsData} options={{ responsive: true }} />
        </div>

        <div className="card">
          <h2>Lighthouse Report</h2>
          <Radar data={lighthouseData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="grid-container">
        {data.images && data.images.map((image, index) => (
          <div key={index} className="card">
            <h2>{image.description}</h2>
            <img src={image.url} alt={image.description} style={{ width: '100%', maxWidth: '300px' }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Summary</h2>
        <p>Total Links: {data.elementCounts.links}</p>
        <p>Total Buttons: {data.elementCounts.buttons}</p>
        <p>Total Paragraphs: {data.elementCounts.paragraphs}</p>
        <p>Total Images: {data.elementCounts.images}</p>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Screenshots</h2>
        <img src={`data:image/jpeg;base64,${data.lighthouseReport.screenshotData}`} alt="Lighthouse Screenshot" style={{ width: '100%', maxWidth: '600px', height: 'auto' }} />
      </div>
    </div>
  );
};

export default Dashboard;
