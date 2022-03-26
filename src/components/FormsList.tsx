import { ClipboardListIcon, LightBulbIcon, TrashIcon } from "@heroicons/react/outline"
import { Link, navigate, useQueryParams } from "raviger"
import React, { useEffect, useState } from "react"
import { FormType } from "../types/formTypes"
import { getLocalForms, saveForms } from "../utils/formUtils"
import { SearchBar } from "./SearchBar"

export default function FormsList(props: {}) {
  const [forms, setForms] = useState(getLocalForms())
  const [{ search }, setQuery] = useQueryParams()
  const [searchString, setSearchString] = useState(() => search ?? "")

  const deleteForm = (id: number) => {
    const filteredLocalForms = forms.filter((formFilter) => formFilter.id !== id)
    setForms(filteredLocalForms)
    saveForms(filteredLocalForms)
  }

  const attemptQuiz = (form: FormType) => {
    const quizForm = {
      id: Number(new Date()),
      formId: form.id,
      label: form.label,
      fields: form.fields,
    }
    localStorage.setItem(`answeredForm_${quizForm.id}`, JSON.stringify(quizForm))
    navigate(`/preview/${quizForm.id}/0`)
  }

  const filterForms = (search?: string) => {
    if (!search) return forms
    return forms.filter((form) => {
      return form.label.toLowerCase().includes(search?.toLowerCase())
    })
  }

  let filteredForms = filterForms(searchString)

  useEffect(() => {
    filteredForms = filterForms(searchString)
    let timeout = setTimeout(() => {
      if (searchString) {
        navigate("/", {
          replace: true,
          query: { search: searchString },
        })
      } else {
        navigate("/", { replace: true })
      }
    }, 1500)
    return () => clearTimeout(timeout)
  }, [searchString])

  return (
    <>
      <SearchBar
        searchString={searchString}
        onFormSubmit={() => {
          navigate("/", { replace: true, query: { search: searchString } })
        }}
        onSearchStringChange={(value) => setSearchString(value)}
      />
      <div className="mb-4 flex flex-col gap-2">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className=" flex w-full items-center gap-2 rounded-lg p-2 hover:bg-sky-200"
          >
            <Link
              className="h-full w-full cursor-pointer px-4 text-lg"
              href={`/form/${form.id}`}
            >
              <span className="block">{form.label}</span>
              <span className="block text-sm text-gray-500">
                {form.fields.length} questions
              </span>
            </Link>
            <Link
              className="ml-auto rounded-lg bg-yellow-500 p-2 font-bold text-white transition duration-300 ease-in-out hover:bg-yellow-700 "
              href={`/attempts?formId=${form.id}`}
              title="attempts"
            >
              <ClipboardListIcon className="h-5 w-5 text-white" />
            </Link>
            <button
              className="rounded-lg bg-green-500 p-2 font-bold text-white transition duration-300 ease-in-out hover:bg-green-700 "
              onClick={() => attemptQuiz(form)}
              title="quiz"
            >
              <LightBulbIcon className="h-5 w-5 text-white" />
            </button>
            <button
              className="rounded-lg bg-red-500 p-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-700 "
              onClick={() => deleteForm(form.id)}
              title="delete"
            >
              <TrashIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        ))}
      </div>
      <Link
        href="/form/new"
        className="block w-full rounded-lg bg-sky-500 px-5 py-2 text-center text-white transition duration-300 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 "
      >
        New Form
      </Link>
    </>
  )
}
