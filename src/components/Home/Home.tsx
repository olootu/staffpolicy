import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import './home.css';
import { userContext } from '../../Context/Context';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const Home = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['docs', page],
    queryFn: fetchData,
    placeholderData: keepPreviousData
  });


  const [pdfCache, setPdfCache] = useState<{ [url: string]: string }>({});
  const [readStatus, setReadStatus] = useState<{ [url: string]: boolean }>({});
  const [pdfLoading, setPdfLoading] = useState(true);

  const profile = useContext(userContext);

  async function fetchData() {
    const response = await fetch(
      `https://bluebirdschildcare.co.uk/wp-json/wp/v2/media?search=.pdf&media_category=policydocs&per_page=100&page=${page}&orderby=date&order=desc&_fields=id,title,source_url,media_category,mime_type,date`

    );
    if (!response.ok) throw new Error('Failed to fetch');
    const total = response.headers.get('X-WP-Total'); // total items
    const totalPages = response.headers.get('X-WP-TotalPages'); // total pages
    const data2 = await response.json();

    const filtered = data2.filter((item: any) => {
      if (!item.media_category) return false;
      return item.media_category.some((cat: any) => cat.slug === "policydocs");
    });
    console.log(filtered)
    console.log('total', total)
    console.log('total Pages', totalPages)
    return { filtered, total: Number(total), totalPages: Number(totalPages) }//filtered;
  }


  const fetchAndSetBlobs = async (pdfLinks: string[]) => {
    const newCache: { [url: string]: string } = {};

    for (const url of pdfLinks) {
      if (pdfCache[url]) {
        newCache[url] = pdfCache[url];
        continue;
      }

      try {
        const encodedUrl = encodeURIComponent(url);
        const res = await fetch(`https://staffpolicy-nodeserver.onrender.com/proxy-pdf?url=${encodedUrl}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        newCache[url] = objectUrl;
      } catch (error) {
        console.error('Error loading PDF:', url, error);
      }
    }

    setPdfCache(prev => ({ ...prev, ...newCache }));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, url: string) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setReadStatus(prev => ({ ...prev, [url]: true }));
    }
  };

  useEffect(() => {
    if (data && Array.isArray(data.filtered)) {
      const pdfLinks = data.filtered
        .filter((item: any) => item.mime_type === 'application/pdf')
        .map((item: any) => item.source_url);

      fetchAndSetBlobs(pdfLinks);
    }
  }, [data]);

  const onDocumentLoadSuccess = () => {
    setPdfLoading(false)
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className='text-green-900 font-bold relative bottom-56'>Loading....</p>
      </div>
    );
  }

  const confirmPdfIsRead = async (url: string) => {

    try {
      const res = await fetch("https://staffpolicy-nodeserver.onrender.com/confirm-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          documentUrl: url,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await res.json();
      console.log("Confirmation stored:", result);
    } catch (err) {
      console.error("Error saving confirmation:", err);
    }
  };


  return (
    <div>
      {pdfLoading &&
        <div className="flex justify-center items-center h-screen">
          <h2 className='text-xl font-bold'>Please wait...</h2>
        </div>
      }

      {!pdfLoading && <h2 className='text-xl ml-96 mb-10 mt-6 font-bold'>Policy Documents</h2>}

      {/* Pagination - Top */}
      {!pdfLoading && <div className="flex gap-4 ml-96 mt-4 mb-4">
        <button className='bg-black text-white p-2' disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Previous</button>
        <span>Page {page} of {data?.totalPages}</span>
        <button className='bg-black text-white p-2' disabled={page === data?.totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>}

      {Object.entries(pdfCache).map(([url, blobUrl], idx) => (
        <div className='doc' key={idx} style={{ marginBottom: "2rem" }}>
          <h4>No: {idx + 1}</h4>
          <h2 className='title'> {url.substring(60, url.indexOf('.pdf'))}</h2>
          <div
            onScroll={(e) => handleScroll(e, url)}
            style={{ height: "500px", overflowY: "scroll", border: "1px solid #ccc" }}
          >
            <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={1} />
              {/* Add more pages here if needed */}
            </Document>
          </div>
          <div className='flex pt-2 bg-blue-900 text-white '>
            <input className='mr-0 w-20'
              type="checkbox"
              disabled={!readStatus[url]}
              onChange={() => confirmPdfIsRead(url)}
            />
            <label className='mt-2 mr-4'>
              I confirm that I have read this document.
            </label>

          </div>
        </div>
      ))}
    {/* Pagination - Bottom */}
      {!pdfLoading && <div className="flex gap-4 ml-96 mt-4 mb-4">
        <button className='bg-black text-white p-2' disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Previous</button>
        <span>Page {page} of {data?.totalPages}</span>
        <button className='bg-black text-white p-2' disabled={page === data?.totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>}

    </div>
  );
};
export default Home