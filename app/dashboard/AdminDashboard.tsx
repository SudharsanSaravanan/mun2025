'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Tabs from '../../components/Tabs';
import { supabase } from "@/lib/supabase";
import FilterBar from '../../components/FilterBar';
import DelegateCard from '../../components/DelegateCard';
import { Committee, Country, UserWithData, Allocation } from '../../types/types';

export default function AdminDashboard() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [committeeMap, setCommitteeMap] = useState<Record<string, Committee>>({});
  const [countryMap, setCountryMap] = useState<Record<string, Country>>({});
  const [users, setUsers] = useState<UserWithData[]>([]);
  const [activeTab, setActiveTab] = useState<'Unallocated' | 'Allocated'>('Unallocated');
  const [filter, setFilter] = useState<'All' | 'Internal' | 'External'>('All');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch committees
      const { data: committeesData, error: committeesError } = await supabase
        .from('committees')
        .select('*')
        .order('name');
      if (committeesError) throw committeesError;
      setCommittees(committeesData);

      const newCommitteeMap = committeesData.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {} as Record<string, Committee>);
      setCommitteeMap(newCommitteeMap);

      // Fetch countries
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      if (countriesError) throw countriesError;
      setCountries(countriesData);

      const newCountryMap = countriesData.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {} as Record<string, Country>);
      setCountryMap(newCountryMap);

      // Fetch registrations
      const { data: internalRegistrations, error: internalError } = await supabase
        .from('internal_registrations')
        .select('*, users!inner(*)');
      if (internalError) throw internalError;

      const { data: externalRegistrations, error: externalError } = await supabase
        .from('external_registrations')
        .select('*, users!inner(*)');
      if (externalError) throw externalError;

      // Combine registrations
      const allUsers = [
        ...internalRegistrations.map(reg => ({ ...reg, type: 'Internal' })),
        ...externalRegistrations.map(reg => ({ ...reg, type: 'External' }))
      ];

      // Fetch allocations
      const { data: allocations, error: allocationError } = await supabase
        .from('allocations')
        .select('*');
      if (allocationError) throw allocationError;

      const allocationsMap = allocations.reduce((acc, alloc) => {
        acc[alloc.user_id] = alloc;
        return acc;
      }, {} as Record<string, Allocation>);

      // Fetch preferences for each user
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
              ),
              ip_committee_preferences (
                committee_order,
                committee_id
              )
            `)
            .eq('user_id', user.user_id)
            .order('preference_order', { ascending: true });

          if (prefsError) throw prefsError;

          return {
            ...user.users,
            ...user,
            is_internal: user.type === 'Internal',
            preferences: preferences || [],
            allocation: allocationsMap[user.user_id] || null
          };
        })
      );

      setUsers(usersWithData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAllocate = async (allocation: Omit<Allocation, 'allocated_at'>) => {
    try {
      const { error } = await supabase.from('allocations').insert(allocation);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error allocating:', error);
    }
  };

    const handleUpdateAllocation = async (allocation: Omit<Allocation, 'allocated_at'>) => {
      try {
        const { error } = await supabase
          .from('allocations')
          .update(allocation)
          .eq('user_id', allocation.user_id);
        if (error) throw error;
        await fetchData();
      } catch (error) {
        console.error('Error updating allocation:', error);
      }
    };

  const handleDeleteAllocation = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('allocations')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting allocation:', error);
    }
  };

  const getAvailableCountries = (committeeId: string): Country[] => {
    const allocatedCountryIds = users
      .filter(u => u.allocation?.committee_id === committeeId)
      .map(u => u.allocation?.country_id)
      .filter(Boolean) as string[];

    return countries.filter(
      c => c.committee_id === committeeId && !allocatedCountryIds.includes(c.id)
    );
  };

  const filteredUsers = users.filter(user => {
    // Filter by allocation status
    if (activeTab === 'Unallocated' && user.allocation) return false;
    if (activeTab === 'Allocated' && !user.allocation) return false;
    
    // Filter by user type
    if (filter === 'Internal' && !user.is_internal) return false;
    if (filter === 'External' && user.is_internal) return false;
    
    return true;
  });

  const unallocatedCount = users.filter(u => !u.allocation).length;
  const allocatedCount = users.filter(u => u.allocation).length;

  return (
    <div className="max-w-7xl mx-auto pt-6">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
          <p className="text-sm font-bold">Total Delegates</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
          <p className="text-sm font-bold">Unallocated</p>
          <p className="text-2xl font-bold">{unallocatedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
          <p className="text-sm font-bold">Allocated</p>
          <p className="text-2xl font-bold">{allocatedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-200">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unallocatedCount={unallocatedCount}
          />
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <FilterBar filter={filter} setFilter={setFilter} />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 className="text-lg font-medium mb-1">No delegates found</h3>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredUsers.map((user) => (
                <DelegateCard
                  key={user.user_id}
                  delegate={user}
                  committees={committees}
                  committeeMap={committeeMap}
                  countryMap={countryMap}
                  getAvailableCountries={getAvailableCountries}
                  onAllocate={handleAllocate}
                  onEditAllocation={handleUpdateAllocation}
                  onDeleteAllocation={handleDeleteAllocation}
                  isAllocated={activeTab === 'Allocated'}
                  filter={filter}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};