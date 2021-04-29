import {createContext, MutableRefObject, ReactNode, useEffect, useRef, useState} from 'react';

interface HomeContextData {
    images: ImageData[];
    canvasRef: MutableRefObject<HTMLCanvasElement>;
    upperText: string;
    lowerText: string;
    onDrop: (acceptedFiles)=> void;
    setUpperText: (value:string) => void;
    setLowerText: (value:string) => void;
    downloadMeme: any;
    fontSz: any;
    fontSize: number;
}

export const HomeContext = createContext({} as HomeContextData);

interface ImageData {
    src: string;
}

interface HomeContextProviderProps {
    children: ReactNode;
}

const HomeContextProvider = ({children}:HomeContextProviderProps) => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [upperText, setUpperText] = useState("");
    const [lowerText, setLowerText] = useState("");
    const canvasRef = useRef(null);
    const [img, setImg] = useState(0);
    const [fontSize, setFontSz] = useState(30);

    useEffect(()=> {
        if (images && images.length) {
            const canvas:HTMLCanvasElement = canvasRef.current;
            const contexto = canvas.getContext('2d');
            var image = new Image();
            image.onload = ()=> {
                canvas.width = 500;
                canvas.height = 500;
                
                contexto.drawImage(image, 0, 0, 500, 500);
                contexto.strokeStyle = "black";
                contexto.font = `${fontSize}pt Impact`;
                contexto.lineWidth = 4;
                contexto.fillStyle = "white";
                const lines = upperText.split('\n');
                
                lines.forEach((line, index)=> {
                    let deslocamento = 60;
                    contexto.strokeText(line, 50, deslocamento + index * 40);
                    contexto.fillText(line, 50, deslocamento + index * 40);
                });
                contexto.strokeText(lowerText, 50, 450);
                contexto.fillText(lowerText, 50, 450);
            }
            if(images[img] === undefined){
                image.src = images[img-1].src;
            }else{
                image.src = images[img].src;
            }
        }
    }, [images, upperText, lowerText]);

    const fontSz = (e: number) => {
       setFontSz(e);
    }
    
    const downloadMeme = () => {
        if(images && images.length > 0) {
            const canvas = canvasRef.current;
            const a = document.createElement('a');
            a.href = canvas.toDataURL();
            a.download = 'download.png';
            document.body.appendChild(a);
            a.click();
        }
    }
    const onDrop = (filesSelected) => {
        filesSelected.map(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const updatedImages:ImageData[] = [...images, {src: `${e.target.result}`}];
            setImages(updatedImages);
            setImg(img+1);
        };
        reader.readAsDataURL(file);
        return file;
        });
    }

    return (
        <HomeContext.Provider value={{
            images,
            upperText,
            lowerText,
            onDrop,
            canvasRef,
            setUpperText,
            setLowerText,
            downloadMeme,
            fontSz,
            fontSize
        }}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeContextProvider;