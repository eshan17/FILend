import { Button } from '../components/Button.js'
export default function Navbar() {
    return(
        <div className="border-b border-gray-300 py-4">
            <div className="container mx-auto flex items-center">
            <p className="font-bold text-fil-blue text-2xl">FilLend</p>
            <nav>
                <ul className="flex">
                    <li>
                        {/* transistion hover below is broken. for some reason bg-gray-200 does nothing. */}
                        <a href="#" className="px-4 transition
                        hover:bg-gray-200 rounded-md">HOME</a>
                    </li>
                    <li>
                    <a href="#" className="px-4 transition
                        hover:bg-gray-200 rounded-md">JUNIOR POOL</a>
                    </li>
                    <li>
                    <a href="#" className="px-4 transition
                        hover:bg-gray-200 rounded-md">SENIOR POOL</a>
                    </li>
                    <li>
                    <a href="#" className="px-4 transition
                        hover:bg-gray-200 rounded-md">LENDERS</a>
                    </li>
                    <li>
                    <a href="#" className="px-4 transition
                        hover:bg-gray-200 rounded-md">BORROWERS</a>
                    </li>
                    <li>
                    <a href="#" className="px-4 transition
                        hover:bg-gray-200 rounded-md">DASHBOARD</a>
                    </li>
                    <li>
                        <Button text="Connect Wallet"></Button>
                    </li>
                </ul>
            </nav>
            </div>
        </div>
    )
}