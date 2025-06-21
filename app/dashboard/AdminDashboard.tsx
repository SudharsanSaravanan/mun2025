'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Tabs from '../../components/Tabs';
import { supabase } from "@/lib/supabase";
import FilterBar from '../../components/FilterBar';
import DelegateCard from '../../components/DelegateCard';
import { Country, Committee, UserWithData, RegistrationSource, Allocation } from '../../types/types';

export default function AdminDashboard() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [countries, setCountries] = useState<Record<string, Country[]>>({});

  const [committeeMap, setCommitteeMap] = useState<Record<string, Committee>>({});
  const [countryMap, setCountryMap] = useState<Record<string, Country>>({});
  const [users, setUsers] = useState<UserWithData[]>([]);

  const [activeTab, setActiveTab] = useState<'Unallocated' | 'Allocated'>('Unallocated');
  const [filter, setFilter] = useState<'All' | 'Internal' | 'External'>('All');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const { data: committeesData, error: committeesError } = await supabase
        .from('committees')
        .select('*')
        .order('name');
      if (committeesError) {
        throw new Error(`Committees fetch failed: ${committeesError.message}`);
      }
      setCommittees(committeesData);

      const committeeMap = committeesData.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {} as Record<string, { id: string; name: string }>);
      setCommitteeMap(committeeMap);

      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      if (countriesError) throw new Error(`Countries fetch failed: ${countriesError.message}`);

      const countryMap = countriesData.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {} as Record<string, { id: string; name: string; committee_id: string }>);
      setCountryMap(countryMap);

      const countriesByCommittee = countriesData.reduce((acc, country) => {
        if (!acc[country.committee_id]) acc[country.committee_id] = [];
        acc[country.committee_id].push(country);
        return acc;
      }, {});
      setCountries(countriesByCommittee);

      const fetchRegistrations = async ({ table, type }: RegistrationSource) => {
        const { data, error } = await supabase
          .from(table)
          .select(`*, users!inner(id, name, email, phone_number)`);
        if (error) throw new Error(`${type} registrations fetch failed: ${error.message}`);
        return data.map(reg => ({ ...reg, type }));
      };

      const [internalUsers, externalUsers] = await Promise.all([
        fetchRegistrations({ table: 'internal_registrations', type: 'Internal' }),
        fetchRegistrations({ table: 'external_registrations', type: 'External' })
      ]);

      const allUsers = [...internalUsers, ...externalUsers];

      const { data: allocations, error: allocationError } = await supabase
        .from('allocations')
        .select('*');
      if (allocationError) throw new Error(`Allocations fetch failed: ${allocationError.message}`);

      const allocationsMap = allocations.reduce((acc, alloc) => {
        acc[alloc.user_id] = alloc;
        return acc;
      }, {});

      const usersWithData = await Promise.all(
        allUsers.map(async (user) => {
          const { data: preferences, error: prefsError } = await supabase
            .from('user_preferences')
            .select(`
              preference_order,
              role,
              ip_subrole,
              committee_id,
              delegate_country_preferences (
                country_order,
                country_id
              )
            `)
            .eq('user_id', user.user_id)
            .order('preference_order', { ascending: true });

          if (prefsError) {
            throw new Error(`Preferences fetch failed for user ${user.user_id}: ${prefsError.message}`);
          }

          const {
            user_id,
            users: userDetails,
            type,
            ...registrationFields
          } = user;

          return {
            user_id,
            email: userDetails.email,
            name: userDetails.name,
            phone_number: userDetails.phone_number,
            is_internal: type === "Internal",
            preferences: preferences || [],
            allocation: allocationsMap[user_id] || null,
            ...registrationFields
          };
        })
      );

      setUsers(usersWithData);
    } catch (e) {
      console.error('fetchData Error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function allocateUser({
    user_id,
    role,
    committee_id,
    country_id,
    ip_subrole
  }: Allocation): Promise<{ success: boolean; error?: string }> {
    const allocationData =
      role === 'delegate'
        ? {
            user_id: user_id,
            role: 'delegate',
            committee_id: committee_id!,
            country_id: country_id!,
            ip_subrole: null
          }
        : {
            user_id: user_id,
            role: 'IP',
            ip_subrole: ip_subrole!,
            committee_id: null,
            country_id: null
          };

    const { error } = await supabase.from('allocations').insert(allocationData);

    if (error) {
      console.error("Allocation insert failed:", error.message);
      return { success: false, error: error.message };
    }

    await fetchData();
    return { success: true };
  }

  async function updateAllocation({
    user_id,
    role,
    committee_id,
    country_id,
    ip_subrole
  }: Allocation): Promise<{ success: boolean; error?: string }> {
    const updateData =
      role === 'delegate'
        ? {
            role: 'delegate',
            committee_id: committee_id!,
            country_id: country_id!,
            ip_subrole: null
          }
        : {
            role: 'IP',
            ip_subrole: ip_subrole!,
            committee_id: null,
            country_id: null
          };

    const { error } = await supabase
      .from('allocations')
      .update(updateData)
      .eq('user_id', user_id);

    if (error) {
      console.error("Allocation update failed:", error.message);
      return { success: false, error: error.message };
    }

    await fetchData();
    return { success: true };
  }

  async function deleteAllocation(user_id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('allocations')
      .delete()
      .eq('user_id', user_id);

    if (error) {
      console.error("Allocation deletion failed:", error.message);
      return { success: false, error: error.message };
    }

    await fetchData();
    return { success: true };
  }

  // const handleAllocate = (delegateId: number, allocation: Allocation) => {
  //   setDelegates((prev) =>
  //     prev.map((delegate) =>
  //       delegate.id === delegateId ? { ...delegate, allocation } : delegate
  //     )
  //   );
  // };

  // const handleEditAllocation = (delegateId: number, allocation: Allocation) => {
  //   setDelegates((prev) =>
  //     prev.map((delegate) =>
  //       delegate.id === delegateId ? { ...delegate, allocation } : delegate
  //     )
  //   );
  // };

  // const handleDeleteAllocation = (delegateId: number) => {
  //   setDelegates((prev) =>
  //     prev.map((delegate) =>
  //       delegate.id === delegateId ? { ...delegate, allocation: null } : delegate
  //     )
  //   );
  // };

  // const filteredDelegates = delegates.filter((delegate) => {
  //   if (filter === 'Internal') return delegate.internal;
  //   if (filter === 'External') return !delegate.internal;
  //   return true;
  // }).filter((delegate) =>
  //   activeTab === 'Unallocated' ? !delegate.allocation : delegate.allocation
  // );

  // const getAvailableCountries = (committee: string) => {
  //   const allocatedCountries = delegates
  //     .filter((d) => d.allocation?.committee === committee)
  //     .map((d) => d.allocation?.country)
  //     .filter((country): country is string => !!country);
  //   return countriesByCommittee[committee]?.filter(
  //     (country) => !allocatedCountries.includes(country)
  //   ) || [];
  // };

  // const unallocatedCount = delegates.filter((d) => !d.allocation).length;
  // const allocatedCount = delegates.filter((d) => d.allocation).length;

  return (
    <div className="min-h-screen bg-white p-6 font-[Roboto] text-black">
     
      <header className="w-full border-b border-gray-300 pb-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <img
                    src="/images/AMUN25_Logo.png"
                    alt="Admin Profile"
                    className="w-14 h-14 rounded-full mr-4 border-4 border-white shadow-md"
                  />
                  <span className="absolute bottom-0 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-xl font-bold">Welcome back</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto pt-13">

        {/* <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
            <p className="text-sm font-bold">Total Delegates</p>
            <p className="text-2xl font-bold">{delegates.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
            <p className="text-sm font-bold">Unallocated</p>
            <p className="text-2xl font-bold">{unallocatedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
            <p className="text-sm font-bold">Allocated</p>
            <p className="text-2xl font-bold">{allocatedCount}</p>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200">
            {/* <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              unallocatedCount={unallocatedCount}
            /> */}
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <FilterBar filter={filter} setFilter={setFilter} />
            </div>
          </div>

          {/* Delegate Cards */}
          {/* <div className="p-6">
            {filteredDelegates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="text-lg font-medium mb-1">No delegates found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDelegates.map((delegate) => (
                  <DelegateCard
                    key={delegate.id}
                    delegate={delegate}
                    committees={committees}
                    getAvailableCountries={getAvailableCountries}
                    onAllocate={handleAllocate}
                    onEditAllocation={handleEditAllocation}
                    onDeleteAllocation={handleDeleteAllocation}
                    isAllocated={activeTab === 'Allocated'}
                    filter={filter}
                  />
                ))}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
