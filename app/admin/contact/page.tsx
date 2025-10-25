"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { ChevronDown, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { PageTransition } from "@/components/animations/page-transition"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { ContactSkeleton } from "@/components/pages/admin/contact/ContactSkeleton"
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
import { useI18n } from "@/lib/i18n"

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/contact")
      const data = await res.json()
      if (data?.success) setContacts(data.contacts as Contact[])
      else toast.error(messages.admin.contact.notifications.load_error)
    } catch {
      toast.error(messages.admin.contact.notifications.load_error)
    } finally {
      setPageLoading(false)
    }
  }, [messages.admin.contact.notifications.load_error])

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user?.email !== "rendiichtiarprasetyo@gmail.com") {
      router.push("/forbidden")
      return
    }
    void fetchContacts()
  }, [fetchContacts, router, session, status])

  const handleReply = useCallback(async () => {
    if (!selectedContact) return
    setActionLoading(true)
    try {
      const res = await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContact.id, replyMessage }),
      })
      const data = await res.json()
      if (!data?.success) throw new Error("failed")
      toast.success(messages.admin.contact.notifications.reply_success)
      setDialogOpen(false)
      setReplyMessage("")
      await fetchContacts()
    } catch {
      toast.error(messages.admin.contact.notifications.reply_error)
    } finally {
      setActionLoading(false)
    }
  }, [
    fetchContacts,
    messages.admin.contact.notifications.reply_error,
    messages.admin.contact.notifications.reply_success,
    replyMessage,
    selectedContact,
  ])

  const openReplyDialog = useCallback((c: Contact) => {
    setSelectedContact(c)
    setDialogOpen(true)
  }, [])

  const columns = useMemo<ColumnDef<Contact>[]>(() => {
    const headBtn = (label: string, column: any) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-4 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    )

    return [
      {
        accessorKey: "createdAt",
        header: ({ column }) => headBtn(messages.admin.contact.table.columns.date, column),
        cell: ({ row }) => (
          <div className="font-medium">
            {formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true, locale: localeID })}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => headBtn(messages.admin.contact.table.columns.name, column),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => headBtn(messages.admin.contact.table.columns.email, column),
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
      },
      {
        accessorKey: "message",
        header: ({ column }) => headBtn(messages.admin.contact.table.columns.message, column),
        cell: ({ row }) => (
          <div className="max-w-[500px]">
            <p className="line-clamp-2 text-muted-foreground">{row.getValue("message")}</p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => headBtn(messages.admin.contact.table.columns.status, column),
        cell: ({ row }) => {
          const status = row.getValue("status") as Contact["status"]
          if (status === "UNREAD") return <Badge variant="destructive" className="font-normal">{messages.admin.contact.table.status.unread}</Badge>
          if (status === "READ") return <Badge variant="secondary" className="font-normal">{messages.admin.contact.table.status.read}</Badge>
          return <Badge variant="default" className="font-normal">{messages.admin.contact.table.status.replied}</Badge>
        },
      },
      {
        id: "actions",
        header: messages.admin.contact.table.columns.actions,
        cell: ({ row }) => {
          const c = row.original
          const disabled = c.status === "REPLIED"
          return (
            <Button
              onClick={() => openReplyDialog(c)}
              disabled={disabled}
              size="sm"
              variant={c.status === "UNREAD" ? "default" : "secondary"}
              className="w-[100px]"
            >
              {disabled ? messages.admin.contact.table.actions.replied : messages.admin.contact.table.actions.reply}
            </Button>
          )
        },
      },
    ]
  }, [messages, openReplyDialog])

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
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  if (pageLoading) {
    return (
      <PageTransition>
        <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
          <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
            <ContactSkeleton />
          </section>
        </main>
      </PageTransition>
    )
  }

  if (!session) return null

  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
        <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{messages.admin.contact.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{messages.admin.contact.subtitle}</p>
          </div>

          <Separator className="my-6 bg-border/60" />

          <Card className="border-none">
            <div className="p-4">
              <div className="flex flex-col items-center gap-4 py-4 sm:flex-row">
                <Input
                  placeholder={messages.admin.contact.table.search}
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                  className="w-full sm:max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:ml-auto sm:w-auto">
                      {messages.admin.contact.table.columns_button}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((c) => c.getCanHide())
                      .map((c) => {
                        const key = c.id as keyof typeof messages.admin.contact.table.columns
                        return (
                          <DropdownMenuCheckboxItem
                            key={c.id}
                            className="capitalize"
                            checked={c.getIsVisible()}
                            onCheckedChange={(v) => c.toggleVisibility(!!v)}
                          >
                            {messages.admin.contact.table.columns[key]}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id} className="border-b border-border/50 hover:bg-transparent">
                        {hg.headers.map((h) => (
                          <TableHead key={h.id} className="h-11 px-6 text-xs">
                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((r) => (
                        <TableRow key={r.id} data-state={r.getIsSelected() && "selected"} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                          {r.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-6 py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          {messages.admin.contact.table.empty}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="order-1 mt-4 flex items-center justify-between gap-4 sm:order-2 sm:mt-6">
                <div className="text-sm text-muted-foreground">
                  {messages.admin.contact.table.total_messages.replace(
                    "{count}",
                    String(table.getFilteredRowModel().rows.length)
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {messages.admin.contact.table.pagination.previous}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {messages.admin.contact.table.pagination.next}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{messages.admin.contact.reply_dialog.title}</DialogTitle>
                <DialogDescription>
                  {messages.admin.contact.reply_dialog.subtitle.replace("{name}", selectedContact?.name || "")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {messages.admin.contact.reply_dialog.original_message}
                    </p>
                    <Badge variant="outline" className="font-normal">
                      {formatDistanceToNow(
                        selectedContact ? new Date(selectedContact.createdAt) : new Date(),
                        { addSuffix: true, locale: localeID }
                      )}
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

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                  {messages.admin.contact.reply_dialog.cancel}
                </Button>
                <Button onClick={handleReply} disabled={actionLoading || !replyMessage.trim()} className="w-full sm:w-auto">
                  {actionLoading ? messages.admin.contact.reply_dialog.sending : messages.admin.contact.reply_dialog.send}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </main>
    </PageTransition>
  )
}
