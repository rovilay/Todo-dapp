import { Web3Provider } from "@ethersproject/providers"
import { Contract, utils } from 'ethers'
import React, { useCallback, useEffect, useRef, useState } from "react"
import Web3Modal from "web3modal"
import BigNumber from "bignumber.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faSpinner, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { CONTRACT_ADDRESS, abi } from '../constants/index'
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export function BasicDateTimePicker({ label, onChange }: any) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(Date.now()));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} className='bg-white rounded-md border-gray-300' />}
        label={label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);

          if (onChange) onChange(dayjs(newValue).valueOf())
        }}
      />
    </LocalizationProvider>
  );
}

interface Chore {
  title: string;
  notes: string;
  priority: number;
  timestamp: number;
  completed?: boolean;
  id?: number;
}

const debounce = (fxn: Function, timeout = 1000) => {
  let timer: number;
    
  // @ts-ignore
  return (...args) => {
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => { fxn.apply(null, args)}, timeout);
  }
}

const processChoreData = (choreData: [title: string, notes: string, priority: number, timestamp: BigNumber, completed: boolean]): Chore => {
  return {
    title: choreData[0],
    notes: choreData[1],
    priority: choreData[2],
    timestamp: choreData[3].toNumber(),
    completed: choreData[4],
  }
}

const priority: { [key: number]: string } = {
  0: "",
  1: "!!",
  2: "!!!",
}

export default function Home() {
  const web3ModalRef = useRef<Web3Modal>();

  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [chores, setChores] = useState<Chore[]>([]);
  const [editChore, setEditChore] = useState<Partial<Chore>>({});

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current?.connect();
    const wrappedProvider = new Web3Provider(provider);
    const signer = wrappedProvider.getSigner();
    return [wrappedProvider, signer];
  }

  const connectWallet = useCallback(async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getChores = useCallback(async () => {
    try {
      // get provider
      const [_, signer] = await getProviderOrSigner();
      const TodoContract = new Contract(CONTRACT_ADDRESS, abi, signer);

      setLoading(true);
      const chores = await TodoContract.getChores() || [];
      // chores.wait();
      setLoading(false);

      setChores(chores.map((chr: any) => processChoreData(chr)));
    } catch (error) {
      console.error('error: ', error);
      setLoading(false);
    }
  }, [setLoading, setChores])

  const addUpdateChore = useCallback(async ({ title, notes, priority, timestamp }: Chore, chrIdx: number = -1) => {
    try {
      const [_, signer] = await getProviderOrSigner();
      const TodoContract = new Contract(CONTRACT_ADDRESS, abi, signer);

      if (chrIdx >= 0) {
        await TodoContract.updateChore(chrIdx, title, notes, priority, timestamp);
      } else {
        await TodoContract.addChore(title, notes, priority, timestamp);
      }
    } catch (error) {
      console.error('error:addUpdateChore: ', error);
      throw error
    }
  }, [])

  const updateChoreStatus = useCallback(async (chrIdx: number, completed: boolean) => {
    try {      
      const [_, signer] = await getProviderOrSigner();
      const TodoContract = new Contract(CONTRACT_ADDRESS, abi, signer);

      await TodoContract.updateStatus(chrIdx, completed);
      const chrs = [...chores]
      chrs[chrIdx] = {
        ...chrs[chrIdx],
        completed
      }
      setChores(chrs)
    } catch (error) {
      console.error('error:updateChoreStatus: ', error);
    }
  }, [chores])

  const deleteChore = useCallback(async (chrIdx: number) => {
    try {
      const [_, signer] = await getProviderOrSigner();
      const TodoContract = new Contract(CONTRACT_ADDRESS, abi, signer);

      await TodoContract.deleteChore(chrIdx);
      const chrs = [...chores].splice(chrIdx, 1)
      setChores(chrs)
    } catch (error) {
      console.error('error:updateChoreStatus: ', error);
    }
  }, [chores])

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    try {
      e.preventDefault();
  
      const { title = '', notes = '', priority = 0, timestamp = Date.now(), id = -1 } = editChore;
  
      setLoading(true);

      await addUpdateChore({ title, notes, priority, timestamp }, id);

      const newChores = [...chores];

      if (id >= 0) {
        newChores[id] = { title, notes, priority, timestamp, id };
      } else {
        newChores.push({ title, notes, priority, timestamp, id });
      }

      setChores(newChores);
    } catch (error) {
      console.error('error:Sumbit: ', error);
    }

    setLoading(false);
    showModal && setShowModal(false);
    setEditChore({ id: -1 });
  }, [addUpdateChore, showModal, editChore, chores])

  useEffect(() => {
    if (walletConnected) {
      getChores();      
      return;
    };

    web3ModalRef.current = new Web3Modal();
    connectWallet();
  }, [walletConnected, connectWallet, getChores]);

  return (
    <>
      {loading &&
      <div className="fixed h-screen w-screen bg-amber-300/10 z-20 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} size="2xl" className="animate-spin text-amber-600" />
      </div>
      }

      <div className="flex flex-col bg-black w-screen h-screen p-6">
        <div className="flex justify-between items-center text-amber-600">
          <h1 className="flex bolder text-4xl text-amber-600">ToDo List</h1>
          <button className="hover:text-amber-700" onClick={() => {
            setEditChore({});
            setShowModal(true)
          }}>
            <FontAwesomeIcon icon={faPlus} size="xl" />
          </button>
        </div>
        
        <div className="flex flex-col">
          {chores.map((chr, i) => {
             if (!chr.title) return null

            return (
              <div className="flex item-start w-full my-4" key={chr.timestamp}>
                <div className="mx-2 py-2">
                  <input
                    className="w-4 h-4 text-amber-600 bg-transparent border-gray-300 focus:ring-amber-600 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:border-gray-600 cursor-pointer"
                    type="checkbox"
                    checked={chr.completed}
                    onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) => updateChoreStatus(i, !e.target.checked))}
                  />
                </div>
                <div className="relative border-b border-amber-600 w-full p-2">
                  <p className="text-white">
                    {!!priority[chr.priority] && <span className="text-amber-600">{priority[chr.priority]} </span>}
                    {chr.title}
                  </p>
                  <p className="text-white py-1">{chr.notes}</p>
                  <p className={chr.timestamp > Date.now() ? "text-gray-300" : "text-rose-600"}>{new Date(chr.timestamp).toLocaleString()}</p>

                  <a className={"cursor-pointer"}>
                    <div className={"absolute top-0 left-0 w-full h-full bg-amber-50/10 opacity-0 hover:opacity-100"}>
                      <div className={"flex justify-end items-center p-2"}>
                        <FontAwesomeIcon icon={faPencil} size="sm"
                          className={"text-amber-600 hover:text-amber-700 py-2 px-2" + (chr.completed ? ' hidden' : '')}
                          onClick={() => {
                            if (chr.completed) return;
          
                            setEditChore({ id: i, ...chores[i] });
                            setShowModal(true);
                          }}
                        />
                        <FontAwesomeIcon icon={faTrash} size="sm" className="text-rose-600 hover:text-rose-700 p-2"
                          onClick={() => {                          
                            deleteChore(i);
                          }}
                        />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* form modal */}
        <div className={`fixed h-screen w-screen bg-amber-300/10 z-10 flex items-center justify-center ${!showModal && "hidden"}`}>
          <div className="mt-5 md:col-span-2 md:mt-0 w-3/6">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-black px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="bolder text-2xl text-amber-600">{(editChore?.id !== undefined && editChore?.id >= 0 )? 'Edit Chore' : 'Add Chore'}</h3>
                    <button className="text-amber-600 cursor-pointer hover:text-amber-700" onClick={() => { 
                      setShowModal(false);
                      setEditChore({ id: -1 });
                    }}>
                      <FontAwesomeIcon icon={faTimes} size="xl"  />
                    </button>
                  </div>

                  <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-12">
                        <label htmlFor="title" className="block text-md font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-2 px-3"
                          value={editChore?.title || ''}
                          onChange={(e) => setEditChore({ ...editChore, title: e.target.value })}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-12">
                        <label htmlFor="notes" className="block text-md font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          value={editChore?.notes || ''}
                          onChange={(e) => setEditChore({ ...editChore, notes: e.target.value })}
                          name="notes"
                          id="notes"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm py-2 px-3"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-12">
                        <label htmlFor="priority" className="block text-md font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                          value={editChore?.priority || 0}
                          onChange={(e) => setEditChore({ ...editChore, priority: Number(e.target.value) || 0 })}
                        >
                          <option value={0}>Low</option>
                          <option value={1}>Medium</option>
                          <option value={2}>High</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-6">
                        <div className="datepicker relative form-floating mb-3 xl:w-96">
                        <label htmlFor="priority" className="block text-md font-medium text-gray-700 pb-1">
                          On date & time
                        </label>
                        <BasicDateTimePicker label="" onChange={(timestamp: number) => setEditChore({ ...editChore, timestamp })} />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
          </div>
        </div>

      </div>
    </>
  )
}
