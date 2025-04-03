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
        
        if (formData.get("price")>50000){
            formData.set("price")==="any";
            console.log(formData.get("price"));
        }
        const data = {
            email: formData.get("email"),
            language: formData.get("language"),
            project_text: formData.get("project_text") || "",
            file: formData.get("descriptionPDF") || "",
            budget: formData.get("price") || ""
        };

        if (!data.email || !data.language || (!data.project_text || !data.file)) {
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
        <>
        <form onSubmit={handleSubmit} className="space-y-5 px-4 py-20 lg:border-x lg:border-berry-blackmail md:flex-1 lg:px-16 bg-gradient-to-r backdrop-blur-[2px] from-[#561B834D] to-[#1A00764D] flex flex-col">
            <div class="flex flex-col space-y-1">
                <label class="font-semibold text-white">E-Mail</label>
                <input id="email" name="email" type="text" required placeholder="example@gmail.com"
                class="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
                />  
            </div>

            <div class="flex flex-col space-y-1">
                <label class="font-semibold text-white">Language</label>
                <select 
                class="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none">
                    <option>English</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Spanish</option>
                </select>    
            </div>
                
            <div class="flex flex-col space-y-1">
                <p class="font-semibold text-white">Description</p>
                <span class="bg-berry-blackmail w-full flex text-white text-center rounded-md">
                    <span class="w-1/2 flex">
                        <input type="radio" value="pdf" name="type" id="pdf" class="hidden peer" onchange="toggleVisibility('pdf')" checked />
                        <label for="pdf" class="w-full cursor-pointer border border-zinc-800 peer-checked:bg-pheromone-purple hover:bg-purple-600 transition-all rounded-l">
                            Upload a PDF
                        </label>
                    </span>
                    <span class="w-1/2 flex">
                        <input type="radio" value="txt" name="type" id="txt" class="hidden peer" onchange="toggleVisibility('txt')" />
                        <label for="txt" class="w-full cursor-pointer border border-zinc-800 peer-checked:bg-pheromone-purple hover:bg-purple-600 transition-all rounded-r">
                            Send a text
                        </label>
                    </span>
                </span>

                <div id="pdf-container" class="p-4 rounded-md transition-all">
                    <input type="file" accept="application/pdf" id="file-upload1" class="hidden" />
                    <label for="file-upload1" class="flex flex-col  items-center justify-center p-3 border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:bg-purple-950/50 w-full h-20">
                        <div class="flex flex-col justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path d="M12 4v16m8-8H4" />
                            </svg>
                            <span class="mt-2 text-gray-300">Upload a PDF</span>
                        </div>
                    </label>
                </div>

                <div id="txt-container" class="hidden p-4 rounded-md transition-all">
                    <textarea class="w-full p-2 text-white rounded-md bg-purple-950/50 focus:outline-none h-24 border border-zinc-500" placeholder="Write your description here..."></textarea>
                </div>
            </div>

            <div class="flex flex-col space-y-1">
                <label class="font-semibold text-white">Limit cost</label>
                <input id="price" name="price" type="range"
                class=" py-2 " min="500" max="50001" value="50001"
                /> 
                <p
                    id="price-value"
                    class="text-white text-center w-full"
                >
                    Any price
                </p>
            </div>

            <div class="w-full flex justify-end">
                <button type='submit' class="self-end px-4 py-2 font-semibold leading-none border rounded-md border-pheromone-purple text-pheromone-purple w-fit bg-pheromone-purple/20">Submit</button>
            </div>
        </form>
        {alert && <Alert {...alert} />}
        </>
    );
}

export default FormComponent;
