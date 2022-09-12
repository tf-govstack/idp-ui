export default function NavHeader() {
    return (
        <nav class="bg-gray-100 border-gray-500 px-2 sm:px-4 py-2.5 rounded light:bg-gray-900">
            <div class="flex items-center md:order-2 justify-end">
                <button type="button" data-dropdown-toggle="language-dropdown-menu" class="inline-flex justify-center items-center p-2 text-sm text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 light:hover:bg-gray-700 light:hover:text-white">
                    <img src="images/language_icon.png" className="mr-2" />
                    English (US)<svg class="ml-1 w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        </nav>
    )
}