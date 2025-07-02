"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"
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
import { PageTransition } from "@/components/animations/page-transition"
import { Separator } from "@/components/ui/separator"
import { ContactSkeleton } from "@/components/admin/contact/ContactSkeleton"

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
    const { messages } = useI18n()
    const { data: session, status } = useSession()
    const router = useRouter()
    const [contacts, setContacts] = useState<Contact[]>([])
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [replyMessage, setReplyMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)

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
            toast.error(messages.admin.contact.notifications.load_error)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            if (status === "loading") return

            if (!session || session.user?.email !== "rendiichtiarprasetyo@gmail.com") {
                router.push("/forbidden")
                return
            }

            try {
                const response = await fetch("/api/contact")
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json()
                setContacts(data.contacts)
            } catch (error) {
                console.error("Error fetching data:", error)
                toast.error(messages.admin.contact.notifications.load_error)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [session, status, router, messages])

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
                toast.success(messages.admin.contact.notifications.reply_success)
                setIsDialogOpen(false)
                setReplyMessage("")
                loadContacts() // Muat ulang data
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error("Error sending reply:", error)
            toast.error(messages.admin.contact.notifications.reply_error)
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
                        size="sm"
                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {messages.admin.contact.table.columns.date}
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
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
                        size="sm"
                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {messages.admin.contact.table.columns.name}
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="font-medium">{row.getValue("name")}</div>
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {messages.admin.contact.table.columns.email}
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="text-muted-foreground">{row.getValue("email")}</div>
            },
        },
        {
            accessorKey: "message",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {messages.admin.contact.table.columns.message}
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="max-w-[500px]">
                        <p className="line-clamp-2 text-muted-foreground">{row.getValue("message")}</p>
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
                        size="sm"
                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {messages.admin.contact.table.columns.status}
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue("status") as Contact["status"]
                switch (status) {
                    case "UNREAD":
                        return <Badge variant="destructive" className="font-normal">{messages.admin.contact.table.status.unread}</Badge>
                    case "READ":
                        return <Badge variant="secondary" className="font-normal">{messages.admin.contact.table.status.read}</Badge>
                    case "REPLIED":
                        return <Badge variant="default" className="font-normal">{messages.admin.contact.table.status.replied}</Badge>
                }
            },
        },
        {
            id: "actions",
            header: messages.admin.contact.table.columns.actions,
            cell: ({ row }) => {
                const contact = row.original as Contact
                return (
                    <Button
                        onClick={() => openReplyDialog(contact)}
                        disabled={contact.status === "REPLIED"}
                        size="sm"
                        variant={contact.status === "UNREAD" ? "default" : "secondary"}
                        className="w-[100px]"
                    >
                        {contact.status === "REPLIED" 
                            ? messages.admin.contact.table.actions.replied 
                            : messages.admin.contact.table.actions.reply}
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

    if (loading) {
        return (
            <PageTransition>
                <main className="min-h-screen bg-background relative lg:pl-64 pt-16 lg:pt-0">
                    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
                        <ContactSkeleton />
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
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{messages.admin.contact.title}</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {messages.admin.contact.subtitle}
                        </p>
                    </div>

                    <Separator className="my-6 bg-border/60" />

                    {/* Table Card */}
                    <Card className="border-none">
                        <div className="p-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
                                <Input
                                    placeholder={messages.admin.contact.table.search}
                                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("name")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full sm:max-w-sm"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                                            {messages.admin.contact.table.columns_button} <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide())
                                            .map((column) => {
                                                const columnKey = column.id as keyof typeof messages.admin.contact.table.columns
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(value) =>
                                                            column.toggleVisibility(!!value)
                                                        }
                                                    >
                                                        {messages.admin.contact.table.columns[columnKey]}
                                                    </DropdownMenuCheckboxItem>
                                                )
                                            })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border/50">
                                                {headerGroup.headers.map((header) => {
                                                    return (
                                                        <TableHead key={header.id} className="h-11 px-6 text-xs">
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
                                                    className="hover:bg-muted/50 border-b border-border/50 last:border-0"
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className="px-6 py-3">
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
                                                    {messages.admin.contact.table.empty}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                                    {messages.admin.contact.table.total_messages.replace("{count}", String(table.getFilteredRowModel().rows.length))}
                                </div>
                                <div className="flex items-center gap-2 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        {messages.admin.contact.table.pagination.previous}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        {messages.admin.contact.table.pagination.next}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Reply Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{messages.admin.contact.reply_dialog.title}</DialogTitle>
                                <DialogDescription>
                                    {messages.admin.contact.reply_dialog.subtitle.replace("{name}", selectedContact?.name || "")}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <p className="font-medium text-sm">{messages.admin.contact.reply_dialog.original_message}</p>
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
                                    placeholder={messages.admin.contact.reply_dialog.placeholder}
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
                                    {messages.admin.contact.reply_dialog.cancel}
                                </Button>
                                <Button
                                    onClick={handleReply}
                                    disabled={isLoading || !replyMessage.trim()}
                                    className="w-full sm:w-auto"
                                >
                                    {isLoading ? messages.admin.contact.reply_dialog.sending : messages.admin.contact.reply_dialog.send}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>
            </main>
        </PageTransition>
    )
} 