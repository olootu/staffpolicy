import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const Home = () => {
  const { data, isLoading } = useQuery({
    queryFn: fetchData,
    queryKey: ['docs']
  });

  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [pdfCache, setPdfCache] = useState<{ [url: string]: string }>({});
  const [readStatus, setReadStatus] = useState<{ [url: string]: boolean }>({});


  async function fetchData() {
    const response = await fetch(
      'https://bluebirdschildcare.co.uk/wp-json/wp/v2/media'
    )
    return await response.json();
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
        const res = await fetch(`http://localhost:8080/proxy-pdf?url=${encodedUrl}`);
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
  
  

  // const fetchAndSetBlobs = async (pdfLinks: string[]) => {
  //   const blobs: string[] = [];

  //   for (const url of pdfLinks) {
  //     try {
  //       const encodedUrl = encodeURIComponent(url);
  //       const res = await fetch(`http://localhost:8080/proxy-pdf?url=${encodedUrl}`);
  //       const blob = await res.blob();
  //       const objectUrl = URL.createObjectURL(blob);
  //       blobs.push(objectUrl);
  //     } catch (error) {
  //       console.error('Error loading PDF:', url, error);
  //     }
  //   }

  //   setPdfUrls(blobs);
  // };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const pdfLinks = data
        .filter((item: any) => item.mime_type === 'application/pdf')
        .map((item: any) => item.source_url);

      fetchAndSetBlobs(pdfLinks);
    }
  }, [data]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log(`Loaded PDF with ${numPages} page(s)`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Policy Documents</h2>
      {/* {pdfUrls.map((pdfUrl, idx) => (
        <div key={idx} style={{ marginBottom: "2rem" }}>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={1} />
          </Document>
        </div>
      ))} */}

{Object.entries(pdfCache).map(([url, blobUrl], idx) => (
  <div key={idx} style={{ marginBottom: "2rem" }}>
    <h4>Document {idx + 1}</h4>
    <div
      onScroll={(e) => handleScroll(e, url)}
      style={{ height: "500px", overflowY: "scroll", border: "1px solid #ccc" }}
    >
      <Document file={blobUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} />
        {/* Add more pages here if needed */}
      </Document>
    </div>
    <label style={{ display: 'block', marginTop: '1rem' }}>
      <input
        type="checkbox"
        disabled={!readStatus[url]}
        onChange={() => console.log(`Confirmed read for ${url}`)}
      />
      I have read and agree to this document.
    </label>
  </div>
))}

    </div>
  );
};
export default Home


// // const Home = () => {
// //   const { data, isLoading } = useQuery({
// //     queryFn: () => fetchData(),
// //     queryKey: ['docs']
// //   });

// //   const [numPage, setNumPage] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);

// //   const [hasRead, setHasRead] = useState(false);
// //   const viewerRef = useRef<HTMLDivElement>(null);

// //   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

// //   function onDocumentLoadSuccess(numPages: any) {
// //     setNumPage(numPages);
// //     setPageNumber(1)
// //   }

// //   const handleScroll = () => {
// //     const el = viewerRef.current;
// //     if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
// //       setHasRead(true);
// //     }
// //   };

  // async function fetchData() {
  //   const response = await fetch(
  //     'https://bluebirdschildcare.co.uk/wp-json/wp/v2/media'
  //   )
  //   return await response.json();
  // }

// //   if (isLoading) {
// //     return <div>Loading...</div>
// //   }

// //   // console.log('Data', data);

// //   const fetchAndSetBlob = async (url: string) => {
// //     const res = await fetch(url);
// //     const blob = await res.blob();
// //     const objectUrl = URL.createObjectURL(blob);
// //     setPdfUrl(objectUrl);
// //   };
// //   useEffect(() => {
// //     if (data && data.length > 0) {
// //       fetchAndSetBlob(data[0].source_url);
// //     }
// //   }, [data]);

// //   return (
// //     <div>   <h2>Policy Document</h2>
// //       {/* {
// //         data.map((res: any) => {
// //           return (
// //             <>

// //               <Document
// //                 // file={res.source_url}
// //                 file='jd.pdf'
// //                 onLoadSuccess={onDocumentLoadSuccess}
// //               >
// //                 {Array.from({ length: pageNumber }, (_, index) => (
// //                   <Page key={index} pageNumber={index + 1} />
// //                 ))}
// //               </Document>
// //               {res.source_url}
// //             </>
// //           )
// //         })
// //       } */}

// // {pdfUrl && (
// //         <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
// //           {Array.from({ length: pageNumber }, (_, index) => (
// //             <Page key={index} pageNumber={index + 1} />
// //           ))}
// //         </Document>
// //       )}
// //     </div>
// //   )
// // }

// // export default Home

// import { useQuery } from '@tanstack/react-query';
// import { useEffect, useRef, useState } from 'react';
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// // Vite-compatible worker setup
// // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// //   'pdfjs-dist/build/pdf.worker.mjs',
// //   import.meta.url
// // ).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

// const Home = () => {
//   const { data, isLoading } = useQuery({
//     queryFn: fetchData,
//     queryKey: ['docs']
//   });

//   const [numPage, setNumPage] = useState<number | null>(null);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [hasRead, setHasRead] = useState(false);
//   const viewerRef = useRef<HTMLDivElement>(null);

//   const [pdfUrls, setPdfUrls] = useState<string[]>([]);

//   async function fetchData() {
//     const response = await fetch(
//       'https://bluebirdschildcare.co.uk/wp-json/wp/v2/media'
//     );
//     const all = await response.json();
//     return all.filter((item: any) => item.mime_type === 'application/pdf');
//   };

//   const fetchAndSetBlobs = async (pdfLinks: string[]) => {
//     const blobs: string[] = [];

//     for (const url of pdfLinks) {
//       try {
//         const encodedUrl = encodeURIComponent(url);
//         const res = await fetch(`http://localhost:8080/proxy-pdf?url=${encodedUrl}`);
//         const blob = await res.blob();
//         const objectUrl = URL.createObjectURL(blob);
//         blobs.push(objectUrl);
//       } catch (error) {
//         console.error('Error loading PDF:', url, error);
//       }
//     }

//     setPdfUrls(blobs);
//   };

//   const handleScroll = () => {
//     const el = viewerRef.current;
//     if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
//       setHasRead(true);
//     }
//   };

//   useEffect(() => {
//     if (data && Array.isArray(data)) {
//       const pdfLinks = data
//         .filter((item: any) => item.mime_type === 'application/pdf')
//         .map((item: any) => item.source_url);

//       fetchAndSetBlobs(pdfLinks);
//     }
//   }, [data]);

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     console.log(`Loaded PDF with ${numPages} page(s)`);
//   };

//   if (isLoading) return <div>Loading...</div>;

//   // const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//   //   setNumPage(numPages);
//   // };

//   // async function fetchData() {
//   //   const response = await fetch(
//   //     'https://bluebirdschildcare.co.uk/wp-json/wp/v2/media'
//   //   );
//   //   const all = await response.json();
//   //   return all.filter((item: any) => item.mime_type === 'application/pdf');
//   // };

//   console.log('data', data)

//   // // const fetchAndSetBlob = async (url: string) => {
//   // //   const res = await fetch(url);
//   // //   console.log('resddsd',res.blob())
//   // //   const blob = await res.blob();
//   // //   const objectUrl = URL.createObjectURL(blob);
//   // //   setPdfUrl(objectUrl);
//   // // };

//   // const fetchAndSetBlob = async () => {
//   //   const remotePdfUrl = encodeURIComponent(`${data[0].source_url}`);
//   //   const res = await fetch(`http://localhost:8080/proxy-pdf?url=${remotePdfUrl}`);
//   //   const blob = await res.blob();
//   //   const objectUrl = URL.createObjectURL(blob);
//   //   setPdfUrl(objectUrl);
//   // };
  
  
//   // useEffect(() => {
//   //   if (data && data.length > 0) {
//   //     fetchAndSetBlob();
//   //   }
//   // }, [data]);

//   // const handleScroll = () => {
//   //   const el = viewerRef.current;
//   //   if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
//   //     setHasRead(true);
//   //   }
//   // };

//   return (
//     <div>
//       <h2>Policy Document</h2>

//       {isLoading && <p>Loading...</p>}

//       <div
//         ref={viewerRef}
//         onScroll={handleScroll}
//         style={{ height: '80vh', overflowY: 'scroll', border: '1px solid #ccc', padding: '1rem' }}
//       >
//         {pdfUrl && (
//           <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
//             {Array.from({ length: numPage || 0 }, (_, index) => (
//               <Page key={index} pageNumber={index + 1} />
//             ))}
//           </Document>
//         )}
//       </div>

//       {hasRead && <p>✅ You have read the document.</p>}
//     </div>
//   );
// };

// export default Home;
