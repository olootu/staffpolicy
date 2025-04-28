import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import './home.css';
import { userContext } from '../../Context/Context';
import * as he from 'he'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const Home = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['docs', page],
    queryFn: fetchData,
    placeholderData: keepPreviousData
  });


  const [pdfCache, setPdfCache] = useState<{ [url: string]: string }>({});
  const [readStatus, setReadStatus] = useState<boolean>(false);
  const [showCloseDocButton, setShowCloseDocButton] = useState<boolean>(true);
  const [disableLaunchButton, setDisableLaunchButton] = useState<boolean>(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setReadStatus(true);
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

  const handlePdfClick = (url: string) => {
    const proxiedUrl = `https://staffpolicy-nodeserver.onrender.com/proxy-pdf?url=${encodeURIComponent(url)}`;
    setSelectedPdf(proxiedUrl);
    setPdfLoading(true);
    setShowCloseDocButton(true);
    setDisableLaunchButton(true)
    // confirmPdfIsRead(url)
    setReadStatus(false)
    console.log(readStatus)
  };

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

  const manageCloseButton = () => {
    setShowCloseDocButton(false);
    setDisableLaunchButton(false)
  }


  return (
    <div className="doc-container p-6">
      <h2 className="text-2xl font-bold mb-4">Policy Documents</h2>

      <div className="flex gap-4 mt-4 mb-4 w-96 ml-96">
        <button className=' bg-black text-white pl-1 pr-1' disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Previous</button>
        <span>Page {page} of {data?.totalPages}</span>
        <button className=' bg-black text-white pl-1 pr-1' disabled={page === data?.totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>

      <div className="space-y-4">
        {data?.filtered.map((item: any, idx: number) => (
          <div key={idx} className="mb-6">
            <div className="doc pdf-link flex justify-between">
              <span className="font-bold">{he.decode(item.title.rendered)}</span>
              <button
                className={disableLaunchButton ? 'bg-gray-500 text-white px-3 py-1 rounded  ' : ' bg-red-600 text-white px-3 py-1 rounded '}
                onClick={() => handlePdfClick(item.source_url)}
                disabled={disableLaunchButton}
              >
                View <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 inline">
  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>

              </button>
            </div>
            {pdfLoading && selectedPdf &&
                    <div className="flex justify-center items-center h-screen">
                      <h2 className='text-xl font-bold'>Please wait...</h2>
                      <div className="w-4 h-4 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                  }
            {selectedPdf?.substring(134, selectedPdf?.indexOf('.pdf')) === item.source_url?.substring(60, item.source_url.indexOf('.pdf')) && showCloseDocButton && (
              <div className="doc relative mt-4 fade-in transition-all duration-700">
                {pdfLoading && (
                  <div className="flex justify-center items-center h-40">
                    <div className="loader"></div>
                  </div>
                )}
                <button
                  className="w-10 h-10 bg-red-600 absolute right-0 z-10 text-white mb-3"
                  onClick={manageCloseButton}
                >
                  &#x2715;
                </button>

                <div
                  onScroll={(e) => handleScroll(e)}
                  style={{
                    height: "400px",
                    overflowY: "scroll",
                    border: "1px solid #222",
                    opacity: pdfLoading ? 0 : 1,
                    transition: "opacity 0.8s ease-in-out",
                  }}
                >
                  
                  
                  <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={1} />
                  </Document>
                </div>

                <div className="flex pt-2 bg-blue-900 text-white ">
                  <input
                    className="mr-0 w-20"
                    type="checkbox"
                    disabled={!readStatus}
                    onChange={() => confirmPdfIsRead('')}
                  />
                  <label className="mt-2 mr-4">
                    I confirm that I have read this document.
                  </label>
                </div>
              </div>
            )}

          </div>

        ))}


      </div>
      {/* <div className="space-y-4">
        {data?.filtered.map((item: any, idx: number) => (
          <div key={idx} className="doc pdf-link flex justify-between">
            <button
              className="text-black-700 font-semibold"

            >
              
              {item.title.rendered.substring(60, item.title.rendered.indexOf('.pdf'))}
            </button>
            <button
              className="text-white p-3 bg-red-600 font-semibold hover:text-blue-900 transition"
              onClick={() => handlePdfClick(item.source_url)}
            >
              Launch
            </button>
          </div>
        ))}
      </div> */}


      {/* {selectedPdf && showCloseDocButton && (
        <div className="doc relative mt-10 fade-in transition-all duration-700">
          {pdfLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="loader"></div>
            </div>
          )}
          <button className='w-10 h-10 bg-blue-900 absolute right-0 z-10 text-white mb-3'
          onClick={() => setShowCloseDocButton(false)}
          >&#x2715;</button>
          <div
            onScroll={(e) => handleScroll(e, '')}
            style={{
              height: "400px",
              overflowY: "scroll",
              border: "1px solid #222",
              opacity: pdfLoading ? 0 : 1,
              transition: "opacity 0.8s ease-in-out",
            }}
          >
            <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={1} />
            </Document>
          </div>
          <div className='flex pt-2 bg-blue-900 text-white '>
            <input className='mr-0 w-20'
              type="checkbox"
              disabled={!readStatus['']}
              onChange={() => confirmPdfIsRead('')}
            />
            <label className='mt-2 mr-4'>
              I confirm that I have read this document.
            </label>


          </div>
        </div>
      )} */}

      <div className="flex gap-4 mt-4 w-96 ml-96">
        <button className=' bg-black text-white pl-1 pr-1' disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Previous</button>
        <span>Page {page} of {data?.totalPages}</span>
        <button className=' bg-black text-white pl-1 pr-1' disabled={page === data?.totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>
    </div>

  );
};
export default Home