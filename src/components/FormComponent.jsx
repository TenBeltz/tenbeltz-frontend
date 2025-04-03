import { useState } from 'react';
import Alert from './Alert';
import { sendProjectEstimate } from '@/services/api';

const FormComponent = () => {
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        console.log("ycycyc")
        console.log(formData.get("email"));
        console.log(formData.get("language"));
        console.log(formData.get("project_text"));
        console.log(formData.get("descriptionPDF"));
        console.log(formData.get("price"));
        
        const price = parseInt(formData.get("price"));
        if (price > 50000) {
            formData.set("price", "any");
        }

        const data = {
            email: formData.get("email"),
            language: formData.get("language"),
            project_text: formData.get("project_text") || "",
            file: formData.get("descriptionPDF") || "",
            budget: formData.get("price") || ""
        };

        // Validación
        if (!data.email || !data.language || (!data.project_text && !data.file)) {
            setAlert({
                id: Date.now(),
                type: "error",
                title: "Error!",
                message: "Please fill out all required fields.",
            });
            return;
        }

        const result = await sendProjectEstimate(data);

        setAlert({
            id: Date.now(),
            type: result.success ? "success" : "error",
            title: result.success ? "Success!" : "Error!",
            message: result.message,
        });

        if (result.success) form.reset();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 px-4 py-20 lg:border-x lg:border-berry-blackmail md:flex-1 lg:px-16 bg-gradient-to-r backdrop-blur-[2px] from-[#561B834D] to-[#1A00764D] flex flex-col">
            <div className="flex flex-col space-y-1">
                <label className="font-semibold text-white">E-Mail</label>
                <input name="email" type="email" required placeholder="example@gmail.com"
                    className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none" />
            </div>

            <div className="flex flex-col space-y-1">
                <label className="font-semibold text-white">Language</label>
                <select name="language" className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none" required>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                </select>
            </div>

            <div className="flex flex-col space-y-1">
                <p className="font-semibold text-white">Description</p>
                <span className="bg-berry-blackmail w-full flex text-white text-center rounded-md">
                    <span className="w-1/2 flex">
                        <input type="radio" value="pdf" name="type" id="pdf" className="hidden peer" checked />
                        <label htmlFor="pdf" className="w-full cursor-pointer border border-zinc-800 peer-checked:bg-pheromone-purple hover:bg-purple-600 transition-all rounded-l">
                            Upload a PDF
                        </label>
                    </span>
                    <span className="w-1/2 flex">
                        <input type="radio" value="txt" name="type" id="txt" className="hidden peer" />
                        <label htmlFor="txt" className="w-full cursor-pointer border border-zinc-800 peer-checked:bg-pheromone-purple hover:bg-purple-600 transition-all rounded-r">
                            Send a text
                        </label>
                    </span>
                </span>

                <div id="pdf-container" className="p-4 rounded-md transition-all">
                    <input type="file" name="descriptionPDF" accept="application/pdf" className="hidden" />
                    <label htmlFor="file-upload1" className="flex flex-col items-center justify-center p-3 border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:bg-purple-950/50 w-full h-20">
                        <div className="flex flex-col justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 text-gray-300">Upload a PDF</span>
                        </div>
                    </label>
                </div>

                <div id="txt-container" className="hidden p-4 rounded-md transition-all">
                    <textarea name="project_text" className="w-full p-2 text-white rounded-md bg-purple-950/50 focus:outline-none h-24 border border-zinc-500" placeholder="Write your description here..."></textarea>
                </div>
            </div>

            <div className="flex flex-col space-y-1">
                <label className="font-semibold text-white">Limit cost</label>
                <input name="price" type="range" min="500" max="50001" defaultValue="50001" className="py-2" />
                <p id="price-value" className="text-white text-center w-full">
                    Any price
                </p>
            </div>

            <div className="w-full flex justify-end">
                <button className="self-end px-4 py-2 font-semibold leading-none border rounded-md border-pheromone-purple text-pheromone-purple w-fit bg-pheromone-purple/20">Submit</button>
            </div>

            {alert && <Alert {...alert} />}
        </form>
    );
};

export default FormComponent;
