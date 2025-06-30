"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { PageTransition } from "@/app/components/page-transition"
import { Separator } from "@/components/ui/separator"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDown, ArrowUpDown } from "lucide-react"

type Contact = {
    id: string
    name: string
    email: string
    message: string
    createdAt: string
    status: "UNREAD" | "READ" | "REPLIED"
}

export default function AdminContactPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [contacts, setContacts] = useState<Contact[]>([])
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [replyMessage, setReplyMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // State untuk data table
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    // Fungsi untuk memuat data kontak
    const loadContacts = async () => {
        try {
            const response = await fetch("/api/contact")
            const data = await response.json()
            if (data.success) {
                setContacts(data.contacts)
            }
        } catch (error) {
            console.error("Error loading contacts:", error)
            toast.error("Gagal memuat data kontak")
        }
    }

    // Memuat data saat komponen dimount
    useEffect(() => {
        // Redirect jika tidak terautentikasi
        if (status === "unauthenticated") {
            router.push("/")
        }
        // Load contacts hanya jika terautentikasi
        if (status === "authenticated") {
            loadContacts()
        }
    }, [status])

    // Fungsi untuk mengirim balasan
    const handleReply = async () => {
        if (!selectedContact) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/contact/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactId: selectedContact.id,
                    replyMessage: replyMessage
                })
            })

            const data = await response.json()
            if (data.success) {
                toast.success("Balasan berhasil dikirim")
                setIsDialogOpen(false)
                setReplyMessage("")
                loadContacts() // Muat ulang data
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error("Error sending reply:", error)
            toast.error("Gagal mengirim balasan")
        } finally {
            setIsLoading(false)
        }
    }

    // Fungsi untuk menampilkan dialog balasan
    const openReplyDialog = (contact: Contact) => {
        setSelectedContact(contact)
        setIsDialogOpen(true)
    }

    // Definisi kolom untuk data table
    const columns: ColumnDef<Contact>[] = [
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tanggal
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="whitespace-nowrap">
                        {formatDistanceToNow(new Date(row.getValue("createdAt")), {
                            addSuffix: true,
                            locale: id
                        })}
                    </div>
                )
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nama
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "message",
            header: "Pesan",
            cell: ({ row }) => {
                return (
                    <div className="max-w-md">
                        <p className="line-clamp-2">{row.getValue("message")}</p>
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue("status") as Contact["status"]
                switch (status) {
                    case "UNREAD":
                        return <Badge variant="destructive">Belum Dibaca</Badge>
                    case "READ":
                        return <Badge variant="secondary">Sudah Dibaca</Badge>
                    case "REPLIED":
                        return <Badge variant="default">Sudah Dibalas</Badge>
                }
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const contact = row.original as Contact
                return (
                    <Button
                        onClick={() => openReplyDialog(contact)}
                        disabled={contact.status === "REPLIED"}
                        size="sm"
                        variant={contact.status === "UNREAD" ? "default" : "secondary"}
                    >
                        {contact.status === "REPLIED" ? "Sudah Dibalas" : "Balas"}
                    </Button>
                )
            },
        },
    ]

    // Inisialisasi table
    const table = useReactTable({
        data: contacts,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Tampilkan loading state
    if (status === "loading") {
        return (
            <PageTransition>
                <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
                    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
                        <div className="flex items-center justify-center h-[60vh]">
                            <p className="text-muted-foreground">Memuat...</p>
                        </div>
                    </section>
                </main>
            </PageTransition>
        )
    }

    // Tampilkan halaman hanya jika terautentikasi
    if (!session) return null

    return (
        <PageTransition>
            <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
                <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
                    {/* Header */}
                    <div className="space-y-2 max-w-3xl">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Pesan</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Kelola dan balas pesan dari pengunjung website.
                        </p>
                    </div>

                    <Separator className="my-6 bg-border/60" />

                    {/* Table Card */}
                    <Card>
                        <div className="p-4">
                            <div className="flex items-center gap-4 py-4">
                                <Input
                                    placeholder="Cari berdasarkan nama..."
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="max-w-sm"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="ml-auto">
                                            Kolom <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide())
                                            .map((column) => {
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(value) =>
                                                            column.toggleVisibility(!!value)
                                                        }
                                                    >
                                                        {column.id === "createdAt" ? "Tanggal" :
                                                            column.id === "name" ? "Nama" :
                                                                column.id === "email" ? "Email" :
                                                                    column.id === "message" ? "Pesan" :
                                                                        column.id === "status" ? "Status" : column.id}
                                                    </DropdownMenuCheckboxItem>
                                                )
                                            })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => {
                                                    return (
                                                        <TableHead key={header.id}>
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                        </TableHead>
                                                    )
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                    data-state={row.getIsSelected() && "selected"}
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length}
                                                    className="h-24 text-center"
                                                >
                                                    Belum ada pesan
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <div className="flex-1 text-sm text-muted-foreground">
                                    {table.getFilteredRowModel().rows.length} pesan
                                </div>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Reply Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Balas Pesan</DialogTitle>
                                <DialogDescription>
                                    Balas pesan dari {selectedContact?.name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <p className="font-medium text-sm">Pesan asli:</p>
                                        <Badge variant="outline" className="font-normal">
                                            {formatDistanceToNow(selectedContact ? new Date(selectedContact.createdAt) : new Date(), {
                                                addSuffix: true,
                                                locale: id
                                            })}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{selectedContact?.message}</p>
                                </div>

                                <Textarea
                                    placeholder="Tulis balasan Anda di sini..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={6}
                                />
                            </div>

                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleReply}
                                    disabled={isLoading || !replyMessage.trim()}
                                    className="w-full sm:w-auto"
                                >
                                    {isLoading ? "Mengirim..." : "Kirim Balasan"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>
            </main>
        </PageTransition>
    )
} 